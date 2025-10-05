<?php
require_once 'config.php';

if ($_POST) {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    try {
        $stmt = $pdo->prepare("SELECT id, username, password_hash FROM usuarios WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && verifyPassword($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            echo json_encode([
                'success' => true, 
                'user' => ['id' => $user['id'], 'username' => $user['username']]
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Credenciais inválidas']);
        }
        
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Erro no servidor']);
    }
}
?>