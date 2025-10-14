<?php
// API de Login - History.io
// Responsável por autenticar usuários no sistema

// Configurações de erro (desabilitar para produção)
error_reporting(0);
ini_set('display_errors', 0);

// Inicia a sessão para manter o usuário logado
session_start();
header('Content-Type: application/json');

// Verifica se a requisição é POST (segurança)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
}

// Importa as configurações do banco de dados
require_once __DIR__ . '/config.php';

// Recebe os dados do formulário
$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

// Validação básica dos campos
if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Usuário e senha são obrigatórios']);
    exit;
}

try {
    // Busca o usuário no banco de dados
    $stmt = $pdo->prepare("SELECT id, username, password_hash, email FROM usuarios WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Verifica se o usuário existe
    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'Usuário ou senha incorretos']);
        exit;
    }
    
    // Verifica se a senha está correta (usando hash seguro)
    if (!password_verify($password, $user['password_hash'])) {
        echo json_encode(['success' => false, 'error' => 'Usuário ou senha incorretos']);
        exit;
    }
    
    // Salva os dados do usuário na sessão
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    
    // Retorna sucesso com os dados do usuário
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]
    ]);
    
} catch (Exception $e) {
    // Registra o erro no log do servidor
    error_log("Erro no login: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Erro ao fazer login']);
}
