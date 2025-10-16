<?php
// adicionar_pontos.php
require_once 'config.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Verificar se usuário está logado
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Usuário não logado']);
        exit;
    }
    
    $userId = $_SESSION['user_id'];
    $modo = $_POST['modo'] ?? '';
    $pontos = intval($_POST['pontos'] ?? 0);
    $acertou = filter_var($_POST['acertou'] ?? false, FILTER_VALIDATE_BOOLEAN);
    
    // Validar dados
    if (!in_array($modo, ['diario', 'ilimitado'])) {
        echo json_encode(['success' => false, 'error' => 'Modo de jogo inválido']);
        exit;
    }
    
    if ($pontos < 0) {
        echo json_encode(['success' => false, 'error' => 'Pontuação inválida']);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        // 1. Registrar na tabela de pontuações
        $stmt = $pdo->prepare("INSERT INTO pontuacoes (usuario_id, modo_jogo, pontos) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $modo, $pontos]);
        
        // 2. Atualizar user_stats usando INSERT ON DUPLICATE KEY UPDATE
        $pontosDiarios = ($modo === 'diario') ? $pontos : 0;
        $pontosIlimitados = ($modo === 'ilimitado') ? $pontos : 0;
        $acertos = $acertou ? 1 : 0;
        $erros = $acertou ? 0 : 1;
        
        $stmt = $pdo->prepare("
            INSERT INTO user_stats 
            (usuario_id, pontos_diarios, pontos_ilimitados, pontos_totais, total_acertos, total_erros) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            pontos_diarios = pontos_diarios + VALUES(pontos_diarios),
            pontos_ilimitados = pontos_ilimitados + VALUES(pontos_ilimitados),
            pontos_totais = pontos_totais + VALUES(pontos_totais),
            total_acertos = total_acertos + VALUES(total_acertos),
            total_erros = total_erros + VALUES(total_erros),
            updated_at = CURRENT_TIMESTAMP
        ");
        $stmt->execute([$userId, $pontosDiarios, $pontosIlimitados, $pontos, $acertos, $erros]);
        
        // 4. Atualizar ofensiva se for modo diário
        if ($modo === 'diario') {
            if ($acertou) {
                // Incrementar ofensiva
                $stmt = $pdo->prepare("
                    UPDATE usuarios 
                    SET ofensiva_atual = ofensiva_atual + 1,
                        recorde_ofensiva = GREATEST(recorde_ofensiva, ofensiva_atual + 1)
                    WHERE id = ?
                ");
                $stmt->execute([$userId]);
            } else {
                // Resetar ofensiva
                $stmt = $pdo->prepare("UPDATE usuarios SET ofensiva_atual = 0 WHERE id = ?");
                $stmt->execute([$userId]);
            }
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Pontos salvos com sucesso',
            'pontos_adicionados' => $pontos,
            'modo' => $modo
        ]);
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Erro ao salvar pontos: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => 'Erro ao salvar pontos no banco']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Método não permitido']);
}
?>