<?php
require_once 'config.php';

$pagina = intval($_GET['pagina'] ?? 1);
$limite = 20;
$offset = ($pagina - 1) * $limite;

try {
    // Buscar ranking com pontos totais
    $stmt = $pdo->prepare("
        SELECT 
            u.id,
            u.username,
            COALESCE(us.pontos_totais, 0) as pontos_totais,
            COALESCE(us.pontos_diarios, 0) as pontos_diarios,
            COALESCE(us.pontos_ilimitados, 0) as pontos_ilimitados,
            u.ofensiva_atual,
            u.recorde_ofensiva,
            RANK() OVER (ORDER BY COALESCE(us.pontos_totais, 0) DESC) as posicao
        FROM usuarios u
        LEFT JOIN user_stats us ON u.id = us.usuario_id
        WHERE u.username IS NOT NULL
        ORDER BY pontos_totais DESC
        LIMIT ? OFFSET ?
    ");
    $stmt->bindValue(1, $limite, PDO::PARAM_INT);
    $stmt->bindValue(2, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Buscar posição do usuário atual (se logado)
    $minhaPosicao = null;
    session_start();
    if (isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];
        $stmt = $pdo->prepare("
            SELECT posicao FROM (
                SELECT 
                    u.id,
                    RANK() OVER (ORDER BY COALESCE(us.pontos_totais, 0) DESC) as posicao
                FROM usuarios u
                LEFT JOIN user_stats us ON u.id = us.usuario_id
                WHERE u.username IS NOT NULL
            ) ranked WHERE id = ?
        ");
        $stmt->execute([$userId]);
        $minhaPosicao = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    echo json_encode([
        'success' => true,
        'ranking' => $ranking,
        'minha_posicao' => $minhaPosicao['posicao'] ?? null,
        'pagina' => $pagina
    ]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Erro ao carregar ranking']);
}
?>