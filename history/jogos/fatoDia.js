// fatoDia.js - SISTEMA COMPLETO DE FATO DO DIA
let vidas = 4;
let respostaCorreta = "";
let jogoAtivo = true;
let ofensivaAtual = 0;
let recordeOfensiva = 0;
let jaJogouHoje = false;
let perguntaDiaId = null;
let pontuacaoAtual = 0;

function carregarPerguntaDoDia() {
    if (!jogoAtivo) return;

    console.log('Carregando pergunta do dia...');
    
    fetch('../api/getPerguntaDoDia.php')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data);
            
            if (data.error) {
                document.getElementById('pergunta').innerHTML = 
                    `<span style="color: red;">Erro: ${data.error}</span>`;
                return;
            }
            
            respostaCorreta = data.correta;
            ofensivaAtual = data.ofensiva_atual || 0;
            recordeOfensiva = data.recorde_ofensiva || 0;
            jaJogouHoje = data.ja_jogou || false;
            perguntaDiaId = data.pergunta_dia_id;
            pontuacaoAtual = data.pontuacao_atual || 0;
            
            document.getElementById('pergunta').innerText = data.pergunta;
            atualizarDisplayOfensiva();

            const respostasDiv = document.getElementById('respostas');
            respostasDiv.innerHTML = '';

            if (jaJogouHoje) {
                // Usuário já jogou hoje - mostrar resultado
                respostasDiv.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <h4 style="color: var(--primary);">🎯 Você já jogou hoje!</h4>
                        <p>Sua pontuação: <strong>${pontuacaoAtual} pontos</strong></p>
                        <p>Ofensiva atual: <strong>${ofensivaAtual} dias</strong></p>
                        <small style="color: #666;">Volte amanhã para uma nova pergunta!</small>
                    </div>
                `;
                jogoAtivo = false;
            } else if (data.respostas && data.respostas.length > 0) {
                // Usuário pode jogar - mostrar respostas
                data.respostas.forEach(texto => {
                    const btn = document.createElement('button');
                    btn.className = 'resposta-btn';
                    btn.textContent = texto;
                    btn.onclick = () => verificarResposta(btn, texto);
                    respostasDiv.appendChild(btn);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar pergunta:', error);
            document.getElementById('pergunta').innerHTML = 
                `<span style="color: red;">Erro: ${error.message}</span>`;
        });
}

function verificarResposta(botao, texto) {
    if (!jogoAtivo || botao.classList.contains('disabled') || jaJogouHoje) return;

    const todosBotoes = document.querySelectorAll('.resposta-btn');
    todosBotoes.forEach(btn => {
        btn.classList.add('disabled');
        btn.onclick = null;
    });

    if (texto === respostaCorreta) {
        botao.classList.add('correct');
        jogoAtivo = false;
        registrarJogada(true, vidas); // Acertou com vidas restantes
    } else {
        botao.classList.add('wrong');
        vidas--;
        atualizarVidas();

        // Mostra a resposta correta
        todosBotoes.forEach(btn => {
            if (btn.textContent === respostaCorreta) {
                btn.classList.add('correct');
            }
        });

        if (vidas <= 0) {
            jogoAtivo = false;
            registrarJogada(false, 0); // Errou todas as vidas
        } else {
            // Ainda tem vidas - continua jogando
            setTimeout(() => {
                // Mantém os botões desabilitados mas permite nova tentativa
                todosBotoes.forEach(btn => {
                    if (!btn.classList.contains('correct')) {
                        btn.classList.remove('disabled', 'wrong');
                        btn.onclick = () => verificarResposta(btn, btn.textContent);
                    }
                });
            }, 2000);
        }
    }
}

function registrarJogada(acertou, vidasRestantes) {
    const formData = new FormData();
    formData.append('pergunta_dia_id', perguntaDiaId);
    formData.append('vidas_restantes', vidasRestantes);
    formData.append('acertou', acertou);
    
    fetch('../api/registrarJogadaDiaria.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            jaJogouHoje = true;
            mostrarResultadoFinal(data.pontuacao, acertou, vidasRestantes);
        } else {
            console.error('Erro ao registrar jogada:', data.error);
            mostrarModal('Erro ao salvar resultado: ' + data.error, false);
        }
    })
    .catch(error => {
        console.error('Erro de conexão:', error);
        mostrarModal('Erro de conexão ao salvar resultado', false);
    });
}

function mostrarResultadoFinal(pontuacao, acertou, vidasRestantes) {
    let mensagem = '';
    let titulo = '';
    
    if (acertou) {
        const mensagensAcerto = [
            "🎉 PERFEITO! Acertou de primeira! +50 pontos",
            "🎉 EXCELENTE! Acertou na segunda! +35 pontos", 
            "🎉 MUITO BEM! Acertou na terceira! +20 pontos",
            "🎉 UFA! Acertou na última! +10 pontos"
        ];
        
        const index = 4 - vidasRestantes; // 0=primeira, 1=segunda, etc.
        mensagem = mensagensAcerto[index] + `\n\n` +
                  `✅ Ofensiva atual: ${ofensivaAtual + 1} dias\n` +
                  `🏆 Recorde: ${Math.max(recordeOfensiva, ofensivaAtual + 1)} dias\n\n` +
                  `Volte amanhã para continuar sua ofensiva!`;
        titulo = 'Parabéns!';
    } else {
        mensagem = `😕 Que pena! Você perdeu.\n\n` +
                  `🔄 Ofensiva reiniciada: 0 dias\n` +
                  `🏆 Seu recorde: ${recordeOfensiva} dias\n\n` +
                  `Volte amanhã para recomeçar!`;
        titulo = 'Que Pena!';
    }
    
    mostrarModal(mensagem, acertou);
    atualizarDisplayOfensiva();
}

function atualizarVidas() {
    const vidasDiv = document.getElementById('vidas');
    const hearts = vidasDiv.querySelectorAll('i');
    
    hearts.forEach((heart, index) => {
        if (index < vidas) {
            heart.classList.remove('lost');
        } else {
            heart.classList.add('lost');
        }
    });
}

function atualizarDisplayOfensiva() {
    const titulo = document.querySelector('.menu-bar h1');
    if (titulo) {
        titulo.innerHTML = `<i class="fas fa-landmark me-2"></i>Fato do Dia <small style="font-size: 0.6em;">(Ofensiva: ${ofensivaAtual} dias)</small>`;
    }
}

function mostrarModal(mensagem, acertou) {
    const modal = document.getElementById('infoModal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    
    modalContent.innerHTML = mensagem.replace(/\n/g, '<br>');
    modalTitle.textContent = acertou ? 'Parabéns!' : 'Que Pena!';
    modal.classList.add('show');

    const modalBtn = modal.querySelector('button');
    const novoBtn = modalBtn.cloneNode(true);
    modalBtn.parentNode.replaceChild(novoBtn, modalBtn);
    
    novoBtn.onclick = () => {
        fecharModal();
        // Recarrega a página para atualizar o estado
        setTimeout(() => location.reload(), 500);
    };
}

function fecharModal() {
    const modal = document.getElementById('infoModal');
    modal.classList.remove('show');
}

let inicializado = false;

function inicializarJogo() {
    if (inicializado) return;
    inicializado = true;
    
    atualizarVidas();
    carregarPerguntaDoDia();
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(inicializarJogo, 100);
});