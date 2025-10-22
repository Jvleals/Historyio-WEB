// fatoDia.js - SISTEMA COMPLETO DE FATO DO DIA

class JogoFatoDia {
    constructor() {
        this.vidas = 4;
        this.respostaCorreta = "";
        this.jogoAtivo = true;
        this.ofensivaAtual = 0;
        this.recordeOfensiva = 0;
        this.jaJogouHoje = false;
        this.perguntaDiaId = null;
        this.pontuacaoAtual = 0;
        this.inicializado = false;
        
        this.init();
    }

    init() {
        if (this.inicializado) return;
        this.inicializado = true;
        
        this.atualizarVidas();
        this.carregarPerguntaDoDia();
        this.configurarEventListeners();
    }

    configurarEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.fecharModal();
        });
        
        document.getElementById('infoModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'infoModal') this.fecharModal();
        });
    }

    async carregarPerguntaDoDia() {
        if (!this.jogoAtivo) return;

        console.log('Carregando pergunta do dia...');
        this.mostrarLoading(true);
        
        try {
            const response = await fetch('../api/getPerguntaDoDia.php');
            
            // Primeiro verifica se a resposta é OK
            if (!response.ok) {
                const text = await response.text();
                console.error('Resposta não OK:', text);
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            
            // Tenta fazer parse do JSON
            const text = await response.text();
            console.log('Resposta bruta:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('Erro ao parsear JSON:', parseError);
                throw new Error('Resposta inválida do servidor');
            }
            
            this.processarDadosPergunta(data);
            
        } catch (error) {
            console.error('Erro ao carregar pergunta:', error);
            this.mostrarErro(`Falha ao carregar pergunta: ${error.message}`);
        } finally {
            this.mostrarLoading(false);
        }
    }

    processarDadosPergunta(data) {
        if (data.error) {
            this.mostrarErro(data.error);
            return;
        }
        
        // Validar dados obrigatórios
        if (!data.pergunta || !data.correta) {
            this.mostrarErro('Dados da pergunta incompletos');
            return;
        }
        
        this.respostaCorreta = data.correta;
        this.ofensivaAtual = data.ofensiva_atual || 0;
        this.recordeOfensiva = data.recorde_ofensiva || 0;
        this.jaJogouHoje = data.ja_jogou || false;
        this.perguntaDiaId = data.pergunta_dia_id;
        this.pontuacaoAtual = data.pontuacao_atual || 0;
        
        document.getElementById('pergunta').innerText = data.pergunta;
        this.atualizarDisplayOfensiva();
        this.renderizarRespostas(data);
    }

    renderizarRespostas(data) {
        const respostasDiv = document.getElementById('respostas');
        respostasDiv.innerHTML = '';

        if (this.jaJogouHoje) {
            this.mostrarResultadoAnterior(data);
        } else if (data.respostas && data.respostas.length > 0) {
            this.criarBotoesResposta(data.respostas);
        } else {
            this.mostrarErro('Nenhuma resposta disponível');
        }
    }

    mostrarResultadoAnterior(data) {
        const respostasDiv = document.getElementById('respostas');
        const acertou = data.acertou ? '✅' : '❌';
        const mensagemAcerto = data.acertou ? 'Parabéns! Você acertou!' : 'Que pena! Você errou.';
        
        respostasDiv.innerHTML = `
            <div class="resultado-anterior">
                <h4>${acertou} Você já jogou hoje!</h4>
                <p>${mensagemAcerto}</p>
                <p>Sua pontuação: <strong>${this.pontuacaoAtual} pontos</strong></p>
                <p>Ofensiva atual: <strong>${this.ofensivaAtual} dias</strong></p>
                <p>Recorde: <strong>${this.recordeOfensiva} dias</strong></p>
                <small class="text-muted">Volte amanhã para uma nova pergunta!</small>
            </div>
        `;
        this.jogoAtivo = false;
    }

    criarBotoesResposta(respostas) {
        const respostasDiv = document.getElementById('respostas');
        
        respostas.forEach(texto => {
            const btn = document.createElement('button');
            btn.className = 'resposta-btn btn btn-outline-primary mb-2';
            btn.textContent = texto;
            btn.onclick = () => this.verificarResposta(btn, texto);
            respostasDiv.appendChild(btn);
        });
    }

    verificarResposta(botao, texto) {
        if (!this.jogoAtivo || botao.classList.contains('disabled') || this.jaJogouHoje) return;

        this.desabilitarBotoes();
        
        if (texto === this.respostaCorreta) {
            this.processarAcerto(botao);
        } else {
            this.processarErro(botao);
        }
    }

    desabilitarBotoes() {
        const todosBotoes = document.querySelectorAll('.resposta-btn');
        todosBotoes.forEach(btn => {
            btn.classList.add('disabled');
            btn.onclick = null;
        });
    }

    processarAcerto(botao) {
        botao.classList.remove('btn-outline-primary');
        botao.classList.add('btn-success');
        this.jogoAtivo = false;
        this.registrarJogada(true, this.vidas);
    }

    processarErro(botao) {
        botao.classList.remove('btn-outline-primary');
        botao.classList.add('btn-danger');
        botao.setAttribute('data-errado', 'true');
        this.vidas--;
        this.atualizarVidas();

        if (this.vidas <= 0) {
            this.jogoAtivo = false;
            setTimeout(() => this.registrarJogada(false, 0), 1000);
        } else {
            this.permitirNovaTentativa();
        }
    }

    permitirNovaTentativa() {
        setTimeout(() => {
            const todosBotoes = document.querySelectorAll('.resposta-btn');
            todosBotoes.forEach(btn => {
                if (!btn.hasAttribute('data-errado')) {
                    btn.classList.remove('disabled', 'btn-danger');
                    btn.classList.add('btn-outline-primary');
                    btn.onclick = () => this.verificarResposta(btn, btn.textContent);
                } else if (btn.hasAttribute('data-errado')) {
                    btn.classList.remove('btn-danger');
                    btn.classList.add('disabled');
                }
            });
        }, 2000);
    }

    async registrarJogada(acertou, vidasRestantes) {
        try {
            const formData = new FormData();
            formData.append('pergunta_dia_id', this.perguntaDiaId);
            formData.append('vidas_restantes', vidasRestantes);
            formData.append('acertou', acertou);
            
            const response = await fetch('../api/registrarJogadaDiaria.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.jaJogouHoje = true;
                this.mostrarResultadoFinal(data.pontuacao, acertou, vidasRestantes);
            } else {
                throw new Error(data.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error('Erro ao registrar jogada:', error);
            this.mostrarModal('Erro ao salvar resultado: ' + error.message, false);
        }
    }

    mostrarResultadoFinal(pontuacao, acertou, vidasRestantes) {
        let mensagem, titulo;
        
        if (acertou) {
            const mensagensAcerto = [
                "🎉 PERFEITO! Acertou de primeira! +50 pontos",
                "🎉 EXCELENTE! Acertou na segunda! +35 pontos", 
                "🎉 MUITO BEM! Acertou na terceira! +20 pontos",
                "🎉 UFA! Acertou na última! +10 pontos"
            ];
            
            const index = 4 - vidasRestantes;
            mensagem = `${mensagensAcerto[index]}\n\n` +
                      `✅ Ofensiva atual: ${this.ofensivaAtual + 1} dias\n` +
                      `🏆 Recorde: ${Math.max(this.recordeOfensiva, this.ofensivaAtual + 1)} dias\n\n` +
                      `Volte amanhã para continuar sua ofensiva!`;
            titulo = 'Parabéns!';
        } else {
            mensagem = `😕 Que pena! Você perdeu.\n\n` +
                      `🔄 Ofensiva reiniciada: 0 dias\n` +
                      `🏆 Seu recorde: ${this.recordeOfensiva} dias\n\n` +
                      `Volte amanhã para recomeçar!`;
            titulo = 'Que Pena!';
        }
        
        this.mostrarModal(mensagem, acertou);
        this.atualizarDisplayOfensiva();
    }

    atualizarVidas() {
        const vidasDiv = document.getElementById('vidas');
        const hearts = vidasDiv?.querySelectorAll('i') || [];
        
        hearts.forEach((heart, index) => {
            heart.classList.toggle('lost', index >= this.vidas);
        });
    }

    atualizarDisplayOfensiva() {
        const titulo = document.querySelector('.menu-bar h1');
        if (titulo) {
            titulo.innerHTML = `
                <i class="fas fa-landmark me-2"></i>
                Fato do Dia 
                <small style="font-size: 0.6em;">(Ofensiva: ${this.ofensivaAtual} dias)</small>
            `;
        }
    }

    mostrarModal(mensagem, acertou) {
        const modal = document.getElementById('infoModal');
        const modalContent = document.getElementById('modalContent');
        const modalTitle = document.getElementById('modalTitle');
        
        if (!modal || !modalContent || !modalTitle) return;
        
        modalContent.innerHTML = mensagem.replace(/\n/g, '<br>');
        modalTitle.textContent = acertou ? 'Parabéns!' : 'Que Pena!';
        modal.classList.add('show');
        modal.style.transform = 'none'
    }

    fecharModal() {
        const modal = document.getElementById('infoModal');
        modal?.classList.remove('show');
    }

    mostrarErro(mensagem) {
        const perguntaDiv = document.getElementById('pergunta');
        perguntaDiv.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle"></i>
                ${mensagem}
            </div>
        `;
    }

    mostrarLoading(mostrar) {
        const perguntaDiv = document.getElementById('pergunta');
        if (mostrar) {
            perguntaDiv.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <p class="mt-2">Carregando pergunta do dia...</p>
                </div>
            `;
        }
    }
}

// Inicializar o jogo quando a página carregar
let jogoAtual;
document.addEventListener('DOMContentLoaded', function() {
    jogoAtual = new JogoFatoDia();
});

// Função global para fechar modal (chamada pelo HTML)
function fecharModal() {
    if (jogoAtual) {
        jogoAtual.fecharModal();
    }
}