import { SistemaPontuacao } from 'pontos.js';

let vidas = 4;
let respostaCorreta = "";
let jogoAtivo = true;
let ofensivaAtual = 0;
let recordeOfensiva = 0;
let jaJogouHoje = false;

function carregarPergunta() {
    if (!jogoAtivo) return;

    fetch('getPergunta.php')
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error('Erro:', data.error);
                mostrarModal('Erro: ' + data.error, false);
                return;
            }
            
            respostaCorreta = data.correta;
            ofensivaAtual = data.ofensiva_atual || 0;
            recordeOfensiva = data.recorde_ofensiva || 0;
            
            document.getElementById('pergunta').innerText = data.pergunta;
            atualizarDisplayOfensiva();

            const respostasDiv = document.getElementById('respostas');
            respostasDiv.innerHTML = '';

            data.respostas.forEach(texto => {
                const btn = document.createElement('button');
                btn.className = 'resposta-btn';
                btn.textContent = texto;
                btn.onclick = () => verificarResposta(btn, texto);
                respostasDiv.appendChild(btn);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar pergunta:', error);
            document.getElementById('pergunta').innerText = 'Erro ao carregar pergunta. Tente novamente.';
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
        
        // SALVAR PONTOS NO BANCO
        SistemaPontuacao.acertouModoDiario().then(sucesso => {
            if (sucesso) {
                console.log('Pontos salvos com sucesso!');
            }
        });
        
        registrarResposta(true);
    } else {
        botao.classList.add('wrong');
        vidas--;
        atualizarVidas();

        todosBotoes.forEach(btn => {
            if (btn.textContent === respostaCorreta) {
                btn.classList.add('correct');
            }
        });

        // SALVAR ERRO NO BANCO
        SistemaPontuacao.errouModoDiario().then(sucesso => {
            if (sucesso) {
                console.log('Erro registrado');
            }
        });

        const vidasDiv = document.getElementById('vidas');
        vidasDiv.classList.add('vibrar');
        setTimeout(() => vidasDiv.classList.remove('vibrar'), 300);

        if (vidas <= 0) {
            jogoAtivo = false;
            registrarResposta(false);
        }
    }
}

function registrarResposta(acertou) {
    const formData = new FormData();
    formData.append('acertou', acertou);

    fetch('registrarResposta.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            // Usuário já jogou hoje
            jaJogouHoje = true;
            mostrarModal(data.error + ' Sua ofensiva atual: ' + ofensivaAtual + ' dias.', false, true);
        } else if (data.success) {
            ofensivaAtual = data.ofensiva_atual;
            recordeOfensiva = data.recorde_ofensiva;
            jaJogouHoje = true;
            
            if (acertou) {
                mostrarModal(
                    `🎉 Parabéns! Resposta correta!\n\n` +
                    `✅ Ofensiva atual: ${ofensivaAtual} dias\n` +
                    `🏆 Recorde: ${recordeOfensiva} dias`,
                    true,
                    false
                );
            } else {
                mostrarModal(
                    `😕 Que pena! Você perdeu.\n\n` +
                    `🔄 Ofensiva reiniciada: 0 dias\n` +
                    `🏆 Seu recorde: ${recordeOfensiva} dias`,
                    false,
                    false
                );
            }
            atualizarDisplayOfensiva();
        }
    })
    .catch(error => {
        console.error('Erro ao registrar resposta:', error);
        mostrarModal('Erro ao salvar resultado. Tente novamente.', false, false);
    });
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
    // Atualiza o título ou adiciona display de ofensiva
    const titulo = document.querySelector('.menu-bar h1');
    titulo.innerHTML = `<i class="fas fa-landmark me-2"></i>Fato do Dia <small style="font-size: 0.6em;">(🔥: ${ofensivaAtual} dias)</small>`;
}

function mostrarModal(mensagem, acertou, jaJogou = false) {
    const modal = document.getElementById('infoModal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    
    modalContent.innerHTML = mensagem.replace(/\n/g, '<br>');
    modalTitle.textContent = jaJogou ? 'Já Jogou Hoje' : (acertou ? 'Parabéns!' : 'Que Pena!');
    modal.classList.add('show');

    // Atualiza o evento do botão do modal
    const modalBtn = modal.querySelector('button');
    modalBtn.textContent = jaJogou ? 'Entendi' : 'Continuar';
    
    modalBtn.onclick = () => {
        fecharModal();
        if (!jaJogou) {
            if (acertou || vidas > 0) {
                // Recarrega para nova tentativa (se ainda tem vidas)
                setTimeout(() => {
                    vidas = 4;
                    jogoAtivo = true;
                    atualizarVidas();
                    carregarPergunta();
                }, 1000);
            } else {
                // Reset completo
                setTimeout(() => {
                    vidas = 4;
                    jogoAtivo = true;
                    atualizarVidas();
                    carregarPergunta();
                }, 1000);
            }
        }
    };
}

function fecharModal() {
    const modal = document.getElementById('infoModal');
    modal.classList.remove('show');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Atualizar ícone do botão
    const darkModeBtn = document.querySelector('.sidebar-content button:nth-child(3)');
    if (isDarkMode) {
        darkModeBtn.innerHTML = '<i class="fas fa-sun me-2"></i>Modo Claro';
    } else {
        darkModeBtn.innerHTML = '<i class="fas fa-moon me-2"></i>Modo Escuro';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carregar preferência de modo escuro
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const darkModeBtn = document.querySelector('.sidebar-content button:nth-child(3)');
        darkModeBtn.innerHTML = '<i class="fas fa-sun me-2"></i>Modo Claro';
    }
    
    atualizarVidas();
    carregarPergunta();
});