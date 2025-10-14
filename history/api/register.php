<?php
// API de Registro - History.io
// Responsável por criar novas contas de usuário

error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

// Aceita apenas requisições POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
    exit;
}

require_once __DIR__ . '/config.php';

// Coleta os dados do formulário de registro
$username = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';

// Validação dos campos obrigatórios
if (empty($username) || empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Todos os campos são obrigatórios']);
    exit;
}

// Verifica se as senhas coincidem
if ($password !== $confirmPassword) {
    echo json_encode(['success' => false, 'error' => 'As senhas não coincidem']);
    exit;
}

// Verifica o tamanho mínimo da senha
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'error' => 'A senha deve ter pelo menos 6 caracteres']);
    exit;
}

// Valida o formato do email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Email inválido']);
    exit;
}

try {
    // Verifica se o nome de usuário já está em uso
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'Nome de usuário já existe']);
        exit;
    }
    
    // Verifica se o email já está cadastrado
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'Email já cadastrado']);
        exit;
    }
    
    // Cria o hash da senha de forma segura
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insere o novo usuário no banco
    $stmt = $pdo->prepare("
        INSERT INTO usuarios (username, email, password_hash, ofensiva_atual, recorde_ofensiva) 
        VALUES (?, ?, ?, 0, 0)
    ");
    $stmt->execute([$username, $email, $passwordHash]);
    $userId = $pdo->lastInsertId();
    
    // Cria as estatísticas iniciais do usuário
    $stmt = $pdo->prepare("
        INSERT INTO user_stats (usuario_id, pontos_totais, pontos_diarios, pontos_ilimitados, total_acertos, total_erros)
        VALUES (?, 0, 0, 0, 0, 0)
    ");
    $stmt->execute([$userId]);
    
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;
    $_SESSION['email'] = $email;
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $userId,
            'username' => $username,
            'email' => $email
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Erro no registro: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Erro ao criar conta']);
}
