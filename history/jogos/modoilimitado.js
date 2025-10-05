// modoIlimitado.js - VERSÃO CORRIGIDA
class SistemaPontuacaoIlimitado {
    static async adicionarPontos(modo, pontos, acertou = false) {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            console.log('Usuário não logado - pontos não salvos');
            return false;
        }
        
        try {
            const formData = new FormData();
            formData.append('modo', modo);
            formData.append('pontos', pontos);
            formData.append('acertou', acertou);
            
            const response = await fetch('../api/adicionar_pontos.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            return data.success;
            
        } catch (error) {
            console.error('Erro ao salvar pontos:', error);
            return false;
        }
    }
}

let respostaCorreta = "";
let jogoAtivo = true;
let pontuacao = 0;
let acertos = 0;
let erros = 0;

// REMOVER a importação problemática por enquanto
// import { SistemaPontuacao } from './pontos.js';

// Função simplificada para salvar pontos (vamos implementar depois)
class SistemaPontuacaoSimples {
    static async acertouModoIlimitado() {
        console.log('+10 pontos (modo ilimitado)');
        return true;
    }
    
    static async adicionarPontos(modo, pontos, acertou) {
        console.log(`Pontos: ${pontos}, Modo: ${modo}, Acertou: ${acertou}`);
        return true;
    }
}

function carregarPergunta() {
    if (!jogoAtivo) return;

    fetch('../api/getPerguntaIlimitado.php')
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error('Erro:', data.error);
                mostrarModal('Erro: ' + data.error, false);
                return;
            }
            
            respostaCorreta = data.correta;
            document.getElementById('pergunta').innerText = data.pergunta;

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

// MODIFIQUE a função verificarResposta:
function verificarResposta(botao, texto) {
    if (!jogoAtivo || botao.classList.contains('disabled')) return;

    const todosBotoes = document.querySelectorAll('.resposta-btn');
    todosBotoes.forEach(btn => {
        btn.classList.add('disabled');
        btn.onclick = null;
    });

    if (texto === respostaCorreta) {
        botao.classList.add('correct');
        acertos++;
        pontuacao += 10;
        atualizarEstatisticas();
        
        // SALVAR PONTOS NO BANCO
        SistemaPontuacaoIlimitado.adicionarPontos('ilimitado', 10, true)
            .then(sucesso => {
                console.log(sucesso ? '✅ +10 pontos salvos!' : '❌ Erro ao salvar pontos');
            });
        
        mostrarModal('🎉 Resposta correta! +10 pontos', true);
    } else {
        botao.classList.add('wrong');
        erros++;
        atualizarEstatisticas();
        
        todosBotoes.forEach(btn => {
            if (btn.textContent === respostaCorreta) {
                btn.classList.add('correct');
            }
        });

        // REGISTRAR ERRO NO BANCO
        SistemaPontuacaoIlimitado.adicionarPontos('ilimitado', 0, false)
            .then(sucesso => {
                console.log(sucesso ? '✅ Erro registrado' : '❌ Erro ao registrar');
            });
        
        mostrarModal('❌ Resposta incorreta! Tente a próxima.', false);
    }
}

function atualizarEstatisticas() {
    document.getElementById('pontos').textContent = pontuacao;
    document.getElementById('acertos').textContent = acertos;
    document.getElementById('erros').textContent = erros;
    
    // Efeito de pulso na pontuação
    const pontosElement = document.getElementById('pontos');
    pontosElement.classList.add('pulse');
    setTimeout(() => pontosElement.classList.remove('pulse'), 500);
}

function mostrarModal(mensagem, acertou) {
    const modal = document.getElementById('infoModal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    
    modalContent.textContent = mensagem;
    modalTitle.textContent = acertou ? 'Correto!' : 'Incorreto!';
    modal.classList.add('show');

    const modalBtn = modal.querySelector('button');
    
    // CORREÇÃO: Remover event listeners anteriores para evitar acumulação
    modalBtn.replaceWith(modalBtn.cloneNode(true));
    const novoBtn = modal.querySelector('button');
    
    novoBtn.onclick = () => {
        fecharModal();
        // CORREÇÃO: Só carrega nova pergunta se o jogo ainda está ativo
        if (jogoAtivo) {
            setTimeout(() => {
                carregarPergunta();
            }, 500);
        }
    };
}

function fecharModal() {
    const modal = document.getElementById('infoModal');
    modal.classList.remove('show');
}

function reiniciarJogo() {
    pontuacao = 0;
    acertos = 0;
    erros = 0;
    jogoAtivo = true;
    atualizarEstatisticas();
    carregarPergunta();
    toggleSidebar(); // Fecha a sidebar
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    const darkModeBtn = document.querySelector('.sidebar-content button:nth-child(3)');
    if (isDarkMode) {
        darkModeBtn.innerHTML = '<i class="fas fa-sun me-2"></i>Modo Claro';
    } else {
        darkModeBtn.innerHTML = '<i class="fas fa-moon me-2"></i>Modo Escuro';
    }
}

// CORREÇÃO: Prevenir múltiplas inicializações
let inicializado = false;

function inicializarJogo() {
    if (inicializado) return;
    inicializado = true;
    
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const darkModeBtn = document.querySelector('.sidebar-content button:nth-child(3)');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '<i class="fas fa-sun me-2"></i>Modo Claro';
        }
    }
    
    atualizarEstatisticas();
    carregarPergunta();
}

// Inicialização segura
document.addEventListener('DOMContentLoaded', function() {
    // Pequeno delay para garantir que tudo carregou
    setTimeout(inicializarJogo, 100);
});

// Tornar funções globais para o HTML
window.reiniciarJogo = reiniciarJogo;
window.toggleSidebar = toggleSidebar;
window.toggleDarkMode = toggleDarkMode;