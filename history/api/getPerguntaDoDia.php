<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
header('Content-Type: application/json');

// Debug inicial
error_log("=== INICIANDO GET PERGUNTA DO DIA ===");

// Verificar sessão
if (!isset($_SESSION['user_id'])) {
    error_log("ERRO: Usuário não logado na sessão");
    echo json_encode(['error' => 'Usuário não logado']);
    exit;
}

$userId = $_SESSION['user_id'];
error_log("Usuário ID da sessão: " . $userId);

// Verificar se config.php existe e carregar
$config_path = __DIR__ . '/config.php';
if (!file_exists($config_path)) {
    error_log("ERRO: config.php não encontrado em: " . $config_path);
    echo json_encode(['error' => 'Arquivo de configuração não encontrado']);
    exit;
}

require_once $config_path;

// Verificar se a conexão com o banco funciona
try {
    $testConnection = $pdo->query("SELECT 1");
    error_log("Conexão com banco: OK");
} catch (Exception $e) {
    error_log("ERRO na conexão com banco: " . $e->getMessage());
    echo json_encode(['error' => 'Erro de conexão com o banco: ' . $e->getMessage()]);
    exit;
}

$dataAtual = date('Y-m-d');
error_log("Data atual: " . $dataAtual);

try {
    // VERIFICAR SE USUÁRIO JÁ JOGOU HOJE
    error_log("Verificando se usuário já jogou hoje...");
    $checkJogada = $pdo->prepare("
        SELECT jd.*, p.texto as pergunta, r.texto as resposta_correta
        FROM jogadas_diarias jd 
        JOIN pergunta_do_dia pd ON jd.pergunta_dia_id = pd.id
        JOIN perguntas p ON pd.pergunta_id = p.id
        JOIN respostas r ON r.pergunta_id = p.id AND r.correta = 1
        WHERE jd.usuario_id = ? AND jd.data_jogo = ?
    ");
    $checkJogada->execute([$userId, $dataAtual]);
    
    if ($checkJogada->rowCount() > 0) {
        error_log("Usuário já jogou hoje");
        $jogada = $checkJogada->fetch(PDO::FETCH_ASSOC);
        
        // Buscar estatísticas do usuário
        $userStats = $pdo->prepare("SELECT ofensiva_atual, recorde_ofensiva FROM usuarios WHERE id = ?");
        $userStats->execute([$userId]);
        $stats = $userStats->fetch(PDO::FETCH_ASSOC);
        
        $response = [
            'ja_jogou' => true,
            'pergunta' => $jogada['pergunta'],
            'correta' => $jogada['resposta_correta'],
            'pontuacao_atual' => $jogada['pontos'],
            'ofensiva_atual' => $stats['ofensiva_atual'] ?? 0,
            'recorde_ofensiva' => $stats['recorde_ofensiva'] ?? 0,
            'acertou' => (bool)$jogada['acertou']
        ];
        
        error_log("Enviando resposta (já jogou): " . json_encode($response));
        echo json_encode($response);
        exit;
    }

    error_log("Usuário ainda não jogou hoje");

    // BUSCAR PERGUNTA DO DIA ATUAL
    error_log("Buscando pergunta do dia para data: " . $dataAtual);
    $perguntaDia = $pdo->prepare("
        SELECT pd.id as pergunta_dia_id, p.id as pergunta_id, p.texto as pergunta, r.texto as resposta_correta
        FROM pergunta_do_dia pd 
        JOIN perguntas p ON pd.pergunta_id = p.id
        JOIN respostas r ON r.pergunta_id = p.id AND r.correta = 1
        WHERE pd.data = ?
    ");
    $perguntaDia->execute([$dataAtual]);
    
    if ($perguntaDia->rowCount() === 0) {
        error_log("Nenhuma pergunta do dia encontrada, criando uma aleatória...");
        
        // Se não tem pergunta para hoje, seleciona uma aleatória
        $perguntaAleatoria = $pdo->prepare("
            SELECT p.id as pergunta_id, p.texto as pergunta, r.texto as resposta_correta 
            FROM perguntas p 
            JOIN respostas r ON r.pergunta_id = p.id AND r.correta = 1
            ORDER BY RAND() 
            LIMIT 1
        ");
        $perguntaAleatoria->execute();
        $perguntaData = $perguntaAleatoria->fetch(PDO::FETCH_ASSOC);
        
        error_log("Pergunta aleatória selecionada: " . $perguntaData['pergunta']);
        
        // Insere como pergunta do dia
        $insertPerguntaDia = $pdo->prepare("
            INSERT INTO pergunta_do_dia (pergunta_id, data) 
            VALUES (?, ?)
        ");
        $insertPerguntaDia->execute([$perguntaData['pergunta_id'], $dataAtual]);
        $perguntaData['pergunta_dia_id'] = $pdo->lastInsertId();
        error_log("Pergunta do dia inserida com ID: " . $perguntaData['pergunta_dia_id']);
        
    } else {
        $perguntaData = $perguntaDia->fetch(PDO::FETCH_ASSOC);
        error_log("Pergunta do dia encontrada: " . $perguntaData['pergunta']);
    }

    // BUSCAR ALTERNATIVAS
    error_log("Buscando alternativas para pergunta ID: " . $perguntaData['pergunta_id']);
    $alternativas = $pdo->prepare("
        SELECT texto 
        FROM respostas 
        WHERE pergunta_id = ? 
        ORDER BY RAND()
    ");
    $alternativas->execute([$perguntaData['pergunta_id']]);
    $respostas = $alternativas->fetchAll(PDO::FETCH_COLUMN);
    if (!$respostas || count($respostas) === 0) {
        $respostas = [$perguntaData['resposta_correta']];
    }
    
    error_log("Alternativas encontradas: " . count($respostas));

    // BUSCAR ESTATÍSTICAS DO USUÁRIO
    $userStats = $pdo->prepare("SELECT ofensiva_atual, recorde_ofensiva FROM usuarios WHERE id = ?");
    $userStats->execute([$userId]);
    $stats = $userStats->fetch(PDO::FETCH_ASSOC);

    $response = [
        'ja_jogou' => false,
        'pergunta_dia_id' => $perguntaData['pergunta_dia_id'],
        'pergunta' => $perguntaData['pergunta'],
        'correta' => $perguntaData['resposta_correta'],
        'respostas' => $respostas,
        'ofensiva_atual' => $stats['ofensiva_atual'] ?? 0,
        'recorde_ofensiva' => $stats['recorde_ofensiva'] ?? 0
    ];
    
    error_log("Enviando resposta final: " . json_encode($response));
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("ERRO CRÍTICO: " . $e->getMessage());
    echo json_encode(['error' => 'Erro ao buscar pergunta: ' . $e->getMessage()]);
}

error_log("=== FINALIZANDO GET PERGUNTA DO DIA ===");
?>