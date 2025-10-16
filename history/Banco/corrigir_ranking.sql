-- Script para corrigir duplicações no ranking
-- Execute este script no phpMyAdmin ou MySQL Workbench

-- 1. Consolidar pontos duplicados em user_stats
-- Cria uma tabela temporária com as somas corretas
CREATE TEMPORARY TABLE temp_stats AS
SELECT 
    usuario_id,
    SUM(pontos_totais) as pontos_totais,
    SUM(pontos_diarios) as pontos_diarios,
    SUM(pontos_ilimitados) as pontos_ilimitados,
    SUM(total_acertos) as total_acertos,
    SUM(total_erros) as total_erros,
    MIN(created_at) as created_at,
    MAX(updated_at) as updated_at
FROM user_stats
GROUP BY usuario_id;

-- 2. Limpar a tabela user_stats
DELETE FROM user_stats;

-- 3. Inserir dados consolidados
INSERT INTO user_stats (usuario_id, pontos_totais, pontos_diarios, pontos_ilimitados, total_acertos, total_erros, created_at, updated_at)
SELECT usuario_id, pontos_totais, pontos_diarios, pontos_ilimitados, total_acertos, total_erros, created_at, updated_at
FROM temp_stats;

-- 4. Adicionar constraint UNIQUE para evitar duplicações futuras
ALTER TABLE user_stats
ADD UNIQUE KEY unique_usuario (usuario_id);

-- 5. Limpar tabela temporária
DROP TEMPORARY TABLE temp_stats;

-- Verificar resultado
SELECT 
    u.id,
    u.username,
    COALESCE(us.pontos_totais, 0) as pontos_totais,
    COALESCE(us.pontos_diarios, 0) as pontos_diarios,
    COALESCE(us.pontos_ilimitados, 0) as pontos_ilimitados
FROM usuarios u
LEFT JOIN user_stats us ON u.id = us.usuario_id
WHERE u.username IS NOT NULL
ORDER BY pontos_totais DESC;
