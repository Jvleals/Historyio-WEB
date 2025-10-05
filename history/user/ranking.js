// ranking.js
class RankingSystem {
    constructor() {
        this.paginaAtual = 1;
        this.carregarRanking();
        this.configurarEventos();
    }

    async carregarRanking(pagina = 1) {
        try {
            const response = await fetch(`../api/get_ranking.php?pagina=${pagina}`);
            const data = await response.json();
            
            if (data.success) {
                this.exibirRanking(data.ranking);
                this.atualizarPaginacao(data.pagina);
                this.exibirMinhaPosicao(data.minha_posicao);
            } else {
                this.exibirErro();
            }
        } catch (error) {
            this.exibirErro();
        }
    }

    exibirRanking(ranking) {
        const rankingList = document.getElementById('rankingList');
        
        if (ranking.length === 0) {
            rankingList.innerHTML = '<div class="text-center py-4 text-muted">Nenhum jogador no ranking ainda</div>';
            return;
        }

        let html = '';
        ranking.forEach((jogador, index) => {
            const posicaoReal = (this.paginaAtual - 1) * 20 + index + 1;
            
            html += `
                <div class="ranking-item ${this.isCurrentUser(jogador.id) ? 'current-user' : ''}">
                    <div class="ranking-pos ${posicaoReal <= 3 ? 'top-' + posicaoReal : ''}">
                        ${posicaoReal}
                    </div>
                    <div class="ranking-info flex-grow-1">
                        <div class="ranking-name">
                            ${jogador.username} ${this.isCurrentUser(jogador.id) ? '<small class="text-primary">(Você)</small>' : ''}
                        </div>
                        <div class="ranking-stats">
                            <small>Total: ${jogador.pontos_totais} pts</small> • 
                            <small>Diário: ${jogador.pontos_diarios}</small> • 
                            <small>Ilimitado: ${jogador.pontos_ilimitados}</small>
                        </div>
                    </div>
                    <div class="ranking-points">
                        ${jogador.pontos_totais}
                    </div>
                </div>
            `;
        });

        rankingList.innerHTML = html;
    }

    isCurrentUser(userId) {
        const currentUserId = localStorage.getItem('user_id');
        return currentUserId && parseInt(currentUserId) === userId;
    }

    exibirMinhaPosicao(posicao) {
        const elemento = document.getElementById('minhaPosicao');
        const spanPosicao = document.getElementById('posicaoUsuario');
        
        if (posicao) {
            elemento.classList.remove('d-none');
            spanPosicao.textContent = `#${posicao}`;
        } else {
            elemento.classList.add('d-none');
        }
    }

    atualizarPaginacao(pagina) {
        this.paginaAtual = pagina;
        document.getElementById('infoPagina').textContent = `Página ${pagina}`;
        document.getElementById('btnAnterior').disabled = pagina === 1;
    }

    exibirErro() {
        document.getElementById('rankingList').innerHTML = 
            '<div class="text-center py-4 text-muted">Erro ao carregar ranking</div>';
    }

    configurarEventos() {
        document.getElementById('btnAnterior').addEventListener('click', () => {
            if (this.paginaAtual > 1) {
                this.carregarRanking(this.paginaAtual - 1);
            }
        });

        document.getElementById('btnProximo').addEventListener('click', () => {
            this.carregarRanking(this.paginaAtual + 1);
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new RankingSystem();
});