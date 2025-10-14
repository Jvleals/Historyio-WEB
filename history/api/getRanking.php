<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/config.php';

try {
    $stmt = $pdo->prepare("
        SELECT 
            u.id,
            u.username,
            us.pontos_totais,
            us.pontos_diarios,
            us.pontos_ilimitados,
            u.ofensiva_atual,
            u.recorde_ofensiva
        FROM usuarios u
        LEFT JOIN user_stats us ON u.id = us.usuario_id
        WHERE u.username != ''
        ORDER BY us.pontos_totais DESC
        LIMIT 50
    ");
    $stmt->execute();
    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'ranking' => $ranking
    ]);
    
} catch (Exception $e) {
    error_log("Erro ao buscar ranking: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Erro ao buscar ranking']);
}
