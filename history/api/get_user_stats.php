<?php
// get_user_stats.php
require_once 'config.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Não autorizado']);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // Buscar dados do usuário e estatísticas
    $stmt = $pdo->prepare("
        SELECT 
            u.username,
            u.ofensiva_atual,
            u.recorde_ofensiva,
            COALESCE(us.pontos_diarios, 0) as pontos_diarios,
            COALESCE(us.pontos_ilimitados, 0) as pontos_ilimitados,
            COALESCE(us.pontos_totais, 0) as pontos_totais,
            COALESCE(us.total_acertos, 0) as total_acertos,
            COALESCE(us.total_erros, 0) as total_erros
        FROM usuarios u
        LEFT JOIN user_stats us ON u.id = us.usuario_id 
        WHERE u.id = ?
    ");
    $stmt->execute([$userId]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'stats' => $stats]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Erro ao carregar dados']);
}
?>