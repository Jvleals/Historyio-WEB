let vidas = 4;
let respostaCorreta = "";
let jogoAtivo = true;

function carregarPergunta() {
    if (!jogoAtivo) return;

    fetch('getPergunta.php')
        .then(res => res.json())
        .then(data => {
            respostaCorreta = data.correta;
            document.getElementById('pergunta').innerText = data.pergunta;

            const respostasDiv = document.getElementById('respostas');
            respostasDiv.innerHTML = ''; // limpa

            data.respostas.forEach(texto => {
                const btn = document.createElement('button');
                btn.className = 'resposta-btn';
                btn.textContent = texto;
                btn.disabled = false;
                btn.style.backgroundColor = ''; // reset cor
                btn.onclick = () => verificarResposta(btn, texto);
                respostasDiv.appendChild(btn);
            });
        })
        .catch(console.error);
}

function verificarResposta(botao, texto) {
    if (!jogoAtivo || botao.disabled) return;

    if (texto === respostaCorreta) {
        botao.style.backgroundColor = '#28a745'; // verde
        botao.disabled = true;
        jogoAtivo = false;
        desabilitarTodos(true);
        mostrarModal('🎉 Parabéns! Resposta correta!', true);
    } else {
        botao.style.backgroundColor = '#d32f2f'; // vermelho
        botao.disabled = true;
        vidas--;
        atualizarVidas();

        // efeito vibrar nas vidas ao perder
        const vidasDiv = document.getElementById('vidas');
        vidasDiv.classList.add('vibrar');
        vidasDiv.addEventListener('animationend', () => {
            vidasDiv.classList.remove('vibrar');
        }, { once: true });

        if (vidas <= 0) {
            jogoAtivo = false;
            desabilitarTodos(false);
            mostrarModal('😕 Que pena! Você perdeu todas as vidas.', false);
        }
    }
}

function desabilitarTodos(acertou) {
    const botoes = document.querySelectorAll('.resposta-btn');
    botoes.forEach(btn => {
        btn.disabled = true;
        if (acertou && btn.textContent === respostaCorreta) {
            btn.style.backgroundColor = '#28a745';
        } else if (!acertou && btn.textContent === respostaCorreta) {
            btn.style.backgroundColor = '#28a745';
        } else {
            btn.style.backgroundColor = '#777'; // cinza para desabilitados
        }
    });
}

function atualizarVidas() {
    const vidaStr = '❤️'.repeat(vidas) + '❌'.repeat(4 - vidas);
    document.getElementById('vidas').innerText = `Vidas: ${vidaStr}`;
}

function mostrarModal(mensagem, acertou) {
    const modal = document.getElementById('modal');
    const texto = document.getElementById('modal-texto');
    const btn = document.getElementById('btn-voltar');

    texto.textContent = mensagem;
    modal.style.display = 'flex';

    btn.onclick = () => {
        modal.style.display = 'none';
        if (acertou || vidas > 0) {
            jogoAtivo = true;
            carregarPergunta();
        } else {
            // Resetar o jogo se perdeu
            vidas = 4;
            atualizarVidas();
            jogoAtivo = true;
            carregarPergunta();
        }
    };
}

window.onload = () => {
    atualizarVidas();
    carregarPergunta();
};

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    const btn = document.querySelector('.dark-mode-btn');
    if (document.body.classList.contains('dark-mode')) {
        btn.textContent = '☀️ Modo Claro';
    } else {
        btn.textContent = '🌙 Modo Escuro';
    }
}
