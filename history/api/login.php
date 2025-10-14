<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
}

require_once __DIR__ . '/config.php';

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Usuário e senha são obrigatórios']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, username, password_hash, email FROM usuarios WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'Usuário ou senha incorretos']);
        exit;
    }
    
    if (!password_verify($password, $user['password_hash'])) {
        echo json_encode(['success' => false, 'error' => 'Usuário ou senha incorretos']);
        exit;
    }
    
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Erro no login: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Erro ao fazer login']);
}
