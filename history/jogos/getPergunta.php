<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "fato_do_dia");

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro de conexão: ' . $mysqli->connect_error]);
    exit;
}

// Data atual no formato YYYY-MM-DD
$dataAtual = date('Y-m-d');

// Verifica se já existe uma pergunta do dia
$perguntaDiaQuery = "SELECT * FROM perguntas_do_dia WHERE data = '$dataAtual' LIMIT 1";
$perguntaDiaResult = $mysqli->query($perguntaDiaQuery);

if ($perguntaDiaResult->num_rows === 0) {
    // Seleciona uma nova pergunta aleatória para o dia
    $perguntaQuery = "SELECT * FROM perguntas ORDER BY RAND() LIMIT 1";
    $perguntaResult = $mysqli->query($perguntaQuery);
    
    if (!$perguntaResult || $perguntaResult->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Nenhuma pergunta encontrada']);
        exit;
    }
    
    $pergunta = $perguntaResult->fetch_assoc();
    $perguntaId = (int) $pergunta['id'];
    
    // Insere a nova pergunta do dia
    $insertQuery = "INSERT INTO perguntas_do_dia (data, pergunta_id) VALUES ('$dataAtual', $perguntaId)";
    $mysqli->query($insertQuery);
} else {
    // Usa a pergunta já definida para hoje
    $perguntaDia = $perguntaDiaResult->fetch_assoc();
    $perguntaId = (int) $perguntaDia['pergunta_id'];
    
    $perguntaQuery = "SELECT * FROM perguntas WHERE id = $perguntaId";
    $perguntaResult = $mysqli->query($perguntaQuery);
    $pergunta = $perguntaResult->fetch_assoc();
}

// Busca a resposta correta
$respostaCorretaQuery = "SELECT texto FROM respostas WHERE pergunta_id = $perguntaId AND correta = 1 LIMIT 1";
$respostaCorretaResult = $mysqli->query($respostaCorretaQuery);
$respostaCorreta = $respostaCorretaResult->fetch_assoc();

// Busca 3 respostas incorretas
$respostasIncorretasQuery = "SELECT texto FROM respostas WHERE pergunta_id = $perguntaId AND correta = 0 ORDER BY RAND() LIMIT 3";
$respostasIncorretasResult = $mysqli->query($respostasIncorretasQuery);

$respostas = [];

while ($row = $respostasIncorretasResult->fetch_assoc()) {
    $respostas[] = $row['texto'];
}

// Adiciona a resposta correta e embaralha
$respostas[] = $respostaCorreta['texto'];
shuffle($respostas);

// Buscar estatísticas do usuário (se existir)
session_start();
$userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
$ofensivaAtual = 0;
$recordeOfensiva = 0;

if ($userId) {
    $statsQuery = "SELECT ofensiva_atual, recorde_ofensiva FROM usuarios WHERE id = $userId";
    $statsResult = $mysqli->query($statsQuery);
    
    if ($statsResult->num_rows > 0) {
        $stats = $statsResult->fetch_assoc();
        $ofensivaAtual = (int) $stats['ofensiva_atual'];
        $recordeOfensiva = (int) $stats['recorde_ofensiva'];
    }
}

echo json_encode([
    'pergunta' => $pergunta['texto'],
    'respostas' => $respostas,
    'correta' => $respostaCorreta['texto'],
    'data' => $dataAtual,
    'ofensiva_atual' => $ofensivaAtual,
    'recorde_ofensiva' => $recordeOfensiva
]);

$mysqli->close();
?>