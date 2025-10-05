<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "fato_do_dia");

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro de conexão: ' . $mysqli->connect_error]);
    exit;
}

// Para simplificar, vamos usar sessão. Em produção, use sistema de login real.
session_start();

if (!isset($_SESSION['user_id'])) {
    // Cria um usuário temporário (em produção, use sistema de autenticação)
    $insertUser = "INSERT INTO usuarios (ofensiva_atual, recorde_ofensiva, data_criacao) VALUES (0, 0, NOW())";
    $mysqli->query($insertUser);
    $_SESSION['user_id'] = $mysqli->insert_id;
}

$userId = $_SESSION['user_id'];
$dataAtual = date('Y-m-d');
$acertou = $_POST['acertou'] === 'true';

// Verifica se o usuário já jogou hoje
$jogouHojeQuery = "SELECT id FROM respostas_usuarios WHERE usuario_id = $userId AND data = '$dataAtual'";
$jogouHojeResult = $mysqli->query($jogouHojeQuery);

if ($jogouHojeResult->num_rows > 0) {
    echo json_encode(['error' => 'Você já jogou hoje! Volte amanhã.']);
    exit;
}

// Busca estatísticas atuais
$statsQuery = "SELECT ofensiva_atual, recorde_ofensiva FROM usuarios WHERE id = $userId";
$statsResult = $mysqli->query($statsQuery);
$stats = $statsResult->fetch_assoc();

$ofensivaAtual = (int) $stats['ofensiva_atual'];
$recordeOfensiva = (int) $stats['recorde_ofensiva'];

if ($acertou) {
    // Incrementa ofensiva
    $novaOfensiva = $ofensivaAtual + 1;
    $novoRecorde = max($recordeOfensiva, $novaOfensiva);
    
    $updateQuery = "UPDATE usuarios SET ofensiva_atual = $novaOfensiva, recorde_ofensiva = $novoRecorde WHERE id = $userId";
} else {
    // Reseta ofensiva
    $updateQuery = "UPDATE usuarios SET ofensiva_atual = 0 WHERE id = $userId";
    $novaOfensiva = 0;
    $novoRecorde = $recordeOfensiva;
}

$mysqli->query($updateQuery);

// Registra a resposta do usuário
$perguntaDiaQuery = "SELECT pergunta_id FROM perguntas_do_dia WHERE data = '$dataAtual'";
$perguntaDiaResult = $mysqli->query($perguntaDiaQuery);
$perguntaDia = $perguntaDiaResult->fetch_assoc();
$perguntaId = $perguntaDia['pergunta_id'];

$insertResposta = "INSERT INTO respostas_usuarios (usuario_id, pergunta_id, data, acertou) VALUES ($userId, $perguntaId, '$dataAtual', " . ($acertou ? 1 : 0) . ")";
$mysqli->query($insertResposta);

echo json_encode([
    'success' => true,
    'ofensiva_atual' => $novaOfensiva,
    'recorde_ofensiva' => $novoRecorde,
    'acertou' => $acertou
]);

$mysqli->close();
?>