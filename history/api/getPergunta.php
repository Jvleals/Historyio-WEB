<?php
// getPerguntaDoDia.php - Sistema de pergunta diária
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$password = '';
$database = 'fato_do_dia';

$mysqli = new mysqli($host, $user, $password, $database);

if ($mysqli->connect_error) {
    echo json_encode(['error' => 'Erro de conexão com o banco']);
    exit;
}

session_start();
$dataAtual = date('Y-m-d');

try {
    // Verificar se já existe pergunta do dia
    $stmt = $mysqli->prepare("SELECT pd.id, pd.pergunta_id, p.texto 
                             FROM pergunta_do_dia pd 
                             JOIN perguntas p ON pd.pergunta_id = p.id 
                             WHERE pd.data = ?");
    $stmt->bind_param('s', $dataAtual);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        // Criar nova pergunta do dia
        $perguntaResult = $mysqli->query("SELECT * FROM perguntas ORDER BY RAND() LIMIT 1");
        if ($perguntaResult->num_rows === 0) {
            echo json_encode(['error' => 'Nenhuma pergunta disponível']);
            exit;
        }
        
        $pergunta = $perguntaResult->fetch_assoc();
        $perguntaId = $pergunta['id'];
        
        $insertStmt = $mysqli->prepare("INSERT INTO pergunta_do_dia (pergunta_id, data) VALUES (?, ?)");
        $insertStmt->bind_param('is', $perguntaId, $dataAtual);
        $insertStmt->execute();
        
        $perguntaTexto = $pergunta['texto'];
        $perguntaDiaId = $mysqli->insert_id;
    } else {
        $perguntaDia = $result->fetch_assoc();
        $perguntaTexto = $perguntaDia['texto'];
        $perguntaId = $perguntaDia['pergunta_id'];
        $perguntaDiaId = $perguntaDia['id'];
    }
    
    // Buscar resposta correta
    $respostaCorretaResult = $mysqli->query(
        "SELECT texto FROM respostas WHERE pergunta_id = $perguntaId AND correta = 1 LIMIT 1"
    );
    $respostaCorreta = $respostaCorretaResult->fetch_assoc();
    
    // Buscar respostas incorretas
    $respostasIncorretasResult = $mysqli->query(
        "SELECT texto FROM respostas WHERE pergunta_id = $perguntaId AND correta = 0 ORDER BY RAND() LIMIT 3"
    );
    
    $respostas = [];
    while ($row = $respostasIncorretasResult->fetch_assoc()) {
        $respostas[] = $row['texto'];
    }
    
    // Adicionar resposta correta e embaralhar
    $respostas[] = $respostaCorreta['texto'];
    shuffle($respostas);
    
    // Verificar se usuário já jogou hoje
    $jaJogou = false;
    $pontuacaoAtual = 0;
    
    if (isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];
        $jogadaStmt = $mysqli->prepare("SELECT pontos, vidas_restantes, acertou 
                                       FROM jogadas_diarias 
                                       WHERE usuario_id = ? AND data_jogo = ?");
        $jogadaStmt->bind_param('is', $userId, $dataAtual);
        $jogadaStmt->execute();
        $jogadaResult = $jogadaStmt->get_result();
        
        if ($jogadaResult->num_rows > 0) {
            $jaJogou = true;
            $jogada = $jogadaResult->fetch_assoc();
            $pontuacaoAtual = $jogada['pontos'];
        }
        
        // Buscar ofensiva atual
        $ofensivaStmt = $mysqli->prepare("SELECT ofensiva_atual, recorde_ofensiva FROM usuarios WHERE id = ?");
        $ofensivaStmt->bind_param('i', $userId);
        $ofensivaStmt->execute();
        $ofensivaResult = $ofensivaStmt->get_result();
        $ofensiva = $ofensivaResult->fetch_assoc();
    }
    
    echo json_encode([
        'pergunta' => $perguntaTexto,
        'respostas' => $respostas,
        'correta' => $respostaCorreta['texto'],
        'data' => $dataAtual,
        'pergunta_dia_id' => $perguntaDiaId,
        'ja_jogou' => $jaJogou,
        'pontuacao_atual' => $pontuacaoAtual,
        'ofensiva_atual' => $ofensiva['ofensiva_atual'] ?? 0,
        'recorde_ofensiva' => $ofensiva['recorde_ofensiva'] ?? 0
    ]);
    
} catch (Exception $e) {
    echo json_encode(['error' => 'Erro no servidor: ' . $e->getMessage()]);
}

$mysqli->close();
?>