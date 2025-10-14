<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Não autenticado']);
    exit;
}

require_once __DIR__ . '/config.php';

try {
    $userId = $_SESSION['user_id'];
    
    $stmt = $pdo->prepare("
        SELECT 
            u.username,
            u.email,
            u.ofensiva_atual,
            u.recorde_ofensiva,
            us.pontos_totais,
            us.pontos_diarios,
            us.pontos_ilimitados,
            us.total_acertos,
            us.total_erros
        FROM usuarios u
        LEFT JOIN user_stats us ON u.id = us.usuario_id
        WHERE u.id = ?
    ");
    $stmt->execute([$userId]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$stats) {
        echo json_encode(['success' => false, 'error' => 'Usuário não encontrado']);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'stats' => $stats
    ]);
    
} catch (Exception $e) {
    error_log("Erro ao buscar estatísticas: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Erro ao buscar estatísticas']);
}
