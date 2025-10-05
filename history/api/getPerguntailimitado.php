<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "fato_do_dia");

if ($mysqli->connect_error) {
    echo json_encode(['error' => 'Erro de conexão']);
    exit;
}

// Seleciona uma pergunta aleatória
$perguntaQuery = "SELECT * FROM perguntas ORDER BY RAND() LIMIT 1";
$perguntaResult = $mysqli->query($perguntaQuery);

if (!$perguntaResult || $perguntaResult->num_rows === 0) {
    echo json_encode(['error' => 'Nenhuma pergunta encontrada']);
    exit;
}

$pergunta = $perguntaResult->fetch_assoc();
$perguntaId = (int) $pergunta['id'];

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

echo json_encode([
    'pergunta' => $pergunta['texto'],
    'respostas' => $respostas,
    'correta' => $respostaCorreta['texto']
]);

$mysqli->close();
?>