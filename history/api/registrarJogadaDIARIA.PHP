<?php
// registrarJogadaDiaria.php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Usuário não logado']);
    exit;
}

$host = 'localhost';
$user = 'root';
$password = '';
$database = 'fato_do_dia';

$mysqli = new mysqli($host, $user, $password, $database);

if ($mysqli->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Erro de conexão']);
    exit;
}

$userId = $_SESSION['user_id'];
$dataAtual = date('Y-m-d');

// Receber dados
$perguntaDiaId = intval($_POST['pergunta_dia_id'] ?? 0);
$vidasRestantes = intval($_POST['vidas_restantes'] ?? 0);
$acertou = filter_var($_POST['acertou'] ?? false, FILTER_VALIDATE_BOOLEAN);

// Calcular pontuação baseada nas vidas restantes
$pontuacao = 0;
if ($acertou) {
    switch ($vidasRestantes) {
        case 4: $pontuacao = 50; break; // Acertou de primeira
        case 3: $pontuacao = 35; break; // Acertou na segunda
        case 2: $pontuacao = 20; break; // Acertou na terceira  
        case 1: $pontuacao = 10; break; // Acertou na quarta
        default: $pontuacao = 0; break;
    }
}

try {
    $mysqli->begin_transaction();
    
    // Verificar se já jogou hoje
    $checkStmt = $mysqli->prepare("SELECT id FROM jogadas_diarias WHERE usuario_id = ? AND data_jogo = ?");
    $checkStmt->bind_param('is', $userId, $dataAtual);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'Você já jogou hoje']);
        exit;
    }
    
    // Registrar jogada
    $insertStmt = $mysqli->prepare("
        INSERT INTO jogadas_diarias (usuario_id, pergunta_dia_id, vidas_restantes, pontos, acertou, data_jogo) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $insertStmt->bind_param('iiiiss', $userId, $perguntaDiaId, $vidasRestantes, $pontuacao, $acertou, $dataAtual);
    $insertStmt->execute();
    
    // Atualizar estatísticas do usuário
    if ($acertou) {
        // Incrementar ofensiva e atualizar recorde
        $updateStmt = $mysqli->prepare("
            UPDATE usuarios 
            SET ofensiva_atual = ofensiva_atual + 1,
                recorde_ofensiva = GREATEST(recorde_ofensiva, ofensiva_atual + 1)
            WHERE id = ?
        ");
        $updateStmt->bind_param('i', $userId);
        $updateStmt->execute();
        
        // Adicionar pontos ao modo diário
        $pontosStmt = $mysqli->prepare("
            INSERT INTO user_stats (usuario_id, pontos_diarios, pontos_totais, total_acertos) 
            VALUES (?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE 
            pontos_diarios = pontos_diarios + VALUES(pontos_diarios),
            pontos_totais = pontos_totais + VALUES(pontos_totais),
            total_acertos = total_acertos + 1
        ");
        $pontosStmt->bind_param('iii', $userId, $pontuacao, $pontuacao);
        $pontosStmt->execute();
    } else {
        // Resetar ofensiva
        $updateStmt = $mysqli->prepare("UPDATE usuarios SET ofensiva_atual = 0 WHERE id = ?");
        $updateStmt->bind_param('i', $userId);
        $updateStmt->execute();
        
        // Registrar erro
        $erroStmt = $mysqli->prepare("
            INSERT INTO user_stats (usuario_id, total_erros) 
            VALUES (?, 1)
            ON DUPLICATE KEY UPDATE total_erros = total_erros + 1
        ");
        $erroStmt->bind_param('i', $userId);
        $erroStmt->execute();
    }
    
    $mysqli->commit();
    
    echo json_encode([
        'success' => true,
        'pontuacao' => $pontuacao,
        'vidas_restantes' => $vidasRestantes,
        'acertou' => $acertou,
        'ofensiva_incrementada' => $acertou
    ]);
    
} catch (Exception $e) {
    $mysqli->rollback();
    echo json_encode(['success' => false, 'error' => 'Erro ao registrar jogada: ' . $e->getMessage()]);
}

$mysqli->close();
?>