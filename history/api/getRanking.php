<?php
require_once 'config.php';

$type = $_GET['type'] ?? 'total';
$currentUserId = isLoggedIn() ? getUserId() : null;

try {
    $orderBy = '';
    switch ($type) {
        case 'diario':
            $orderBy = 'pontos_diarios DESC';
            break;
        case 'ilimitado':
            $orderBy = 'pontos_ilimitados DESC';
            break;
        default:
            $orderBy = '(pontos_diarios + pontos_ilimitados) DESC';
    }
    
    $stmt = $pdo->prepare("
        SELECT u.id, u.username, us.pontos_diarios, us.pontos_ilimitados 
        FROM usuarios u 
        JOIN user_stats us ON u.id = us.usuario_id 
        ORDER BY $orderBy 
        LIMIT 100
    ");
    $stmt->execute();
    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $currentUser = null;
    if ($currentUserId) {
        $stmt = $pdo->prepare("
            SELECT u.id, u.username, us.pontos_diarios, us.pontos_ilimitados 
            FROM usuarios u 
            JOIN user_stats us ON u.id = us.usuario_id 
            WHERE u.id = ?
        ");
        $stmt->execute([$currentUserId]);
        $currentUser = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    echo json_encode([
        'success' => true,
        'ranking' => $ranking,
        'currentUser' => $currentUser
    ]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Erro ao carregar ranking']);
}
?>