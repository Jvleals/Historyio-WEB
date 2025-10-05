<?php
require_once 'config.php';

if ($_POST) {
    $username = trim($_POST['username']);
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'];

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'error' => 'Preencha todos os campos']);
        exit;
    }

    try {
        // Verificar se usuário existe
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE username = ?");
        $stmt->execute([$username]);
        
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'error' => 'Usuário já existe']);
            exit;
        }

        // Criar usuário
        $passwordHash = hashPassword($password);
        $stmt = $pdo->prepare("INSERT INTO usuarios (username, email, password_hash) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $passwordHash]);
        
        $userId = $pdo->lastInsertId();

        // Criar stats
        $stmt = $pdo->prepare("INSERT INTO user_stats (usuario_id) VALUES (?)");
        $stmt->execute([$userId]);

        $_SESSION['user_id'] = $userId;
        $_SESSION['username'] = $username;

        echo json_encode(['success' => true, 'message' => 'Conta criada!']);

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Erro no servidor']);
    }
}
?>