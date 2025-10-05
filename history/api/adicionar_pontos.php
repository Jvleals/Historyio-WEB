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
        
        // 2. Determinar qual campo atualizar
        $campoPontos = ($modo === 'diario') ? 'pontos_diarios' : 'pontos_ilimitados';
        $campoEstatistica = $acertou ? 'total_acertos' : 'total_erros';
        
        // 3. Verificar se já existe registro em user_stats
        $stmt = $pdo->prepare("SELECT id FROM user_stats WHERE usuario_id = ?");
        $stmt->execute([$userId]);
        $existeStats = $stmt->fetch();
        
        if ($existeStats) {
            // Atualizar registro existente
            $stmt = $pdo->prepare("
                UPDATE user_stats 
                SET $campoPontos = $campoPontos + ?,
                    $campoEstatistica = $campoEstatistica + 1,
                    pontos_totais = pontos_totais + ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE usuario_id = ?
            ");
            $stmt->execute([$pontos, $pontos, $userId]);
        } else {
            // Criar novo registro
            $valores = array_fill(0, 7, 0);
            $valores[0] = $userId; // usuario_id
            $valores[array_search($campoPontos, ['pontos_diarios', 'pontos_ilimitados']) + 1] = $pontos;
            $valores[array_search($campoEstatistica, ['total_acertos', 'total_erros']) + 3] = 1;
            $valores[5] = $pontos; // pontos_totais
            
            $stmt = $pdo->prepare("
                INSERT INTO user_stats 
                (usuario_id, pontos_diarios, pontos_ilimitados, total_acertos, total_erros, pontos_totais) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute($valores);
        }
        
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