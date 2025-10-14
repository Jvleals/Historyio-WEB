// ===== SISTEMA DE LOGIN =====
// Processa o formulário de login
const formLogin = document.getElementById('formLogin');
if (formLogin) {
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário
        
        const formData = new FormData(formLogin);
        
        try {
            // Envia os dados para a API de login
            const response = await fetch('../api/login.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Login realizado com sucesso!');
                window.location.href = '../index.html'; // Redireciona para a página principal
            } else {
                alert('Erro: ' + data.error);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao conectar com o servidor');
        }
    });
    
    // Botão para mostrar/ocultar senha
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
}

// ===== SISTEMA DE CADASTRO =====
// Processa o formulário de criação de conta
const formCadastro = document.getElementById('formCadastro');
if (formCadastro) {
    formCadastro.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(formCadastro);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');
        
        // Valida se as senhas são iguais antes de enviar
        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        
        try {
            // Envia os dados para a API de registro
            const response = await fetch('../api/register.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Conta criada com sucesso!');
                window.location.href = '../index.html';
            } else {
                alert('Erro: ' + data.error);
            }
        } catch (error) {
            console.error('Erro ao criar conta:', error);
            alert('Erro ao conectar com o servidor');
        }
    });
}

// ===== SISTEMA DE RANKING =====
// Carrega e exibe o ranking global dos jogadores
const rankingList = document.getElementById('rankingList');
if (rankingList) {
    loadRanking();
}

async function loadRanking() {
    try {
        const response = await fetch('../api/getRanking.php');
        const data = await response.json();
        
        if (data.success && data.ranking) {
            rankingList.innerHTML = '';
            
            // Percorre cada usuário do ranking
            data.ranking.forEach((user, index) => {
                const position = index + 1;
                // Adiciona medalhas para os 3 primeiros colocados
                const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : position;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="text-center fw-bold">${medal}</td>
                    <td>${user.username}</td>
                    <td class="text-center">${user.pontos_totais || 0}</td>
                    <td class="text-center">${user.ofensiva_atual || 0}</td>
                    <td class="text-center">${user.recorde_ofensiva || 0}</td>
                `;
                rankingList.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar ranking:', error);
    }
}

// ===== SISTEMA DE PERFIL =====
// Carrega as estatísticas do usuário logado
const statsContainer = document.getElementById('statsContainer');
if (statsContainer) {
    loadStats();
}

async function loadStats() {
    try {
        const response = await fetch('../api/getStats.php');
        const data = await response.json();
        
        if (data.success && data.stats) {
            const stats = data.stats;
            
            // Preenche os dados do perfil na página
            
            document.getElementById('username').textContent = stats.username;
            document.getElementById('email').textContent = stats.email;
            document.getElementById('pontosTotais').textContent = stats.pontos_totais || 0;
            document.getElementById('pontosDiarios').textContent = stats.pontos_diarios || 0;
            document.getElementById('pontosIlimitados').textContent = stats.pontos_ilimitados || 0;
            document.getElementById('totalAcertos').textContent = stats.total_acertos || 0;
            document.getElementById('totalErros').textContent = stats.total_erros || 0;
            document.getElementById('ofensivaAtual').textContent = stats.ofensiva_atual || 0;
            document.getElementById('recordeOfensiva').textContent = stats.recorde_ofensiva || 0;
            
            // Calcula a taxa de acerto do jogador
            const totalJogos = (stats.total_acertos || 0) + (stats.total_erros || 0);
            const taxaAcerto = totalJogos > 0 ? ((stats.total_acertos / totalJogos) * 100).toFixed(1) : 0;
            document.getElementById('taxaAcerto').textContent = taxaAcerto + '%';
        } else {
            alert('Você precisa estar logado para ver seu perfil');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        alert('Erro ao carregar suas estatísticas');
    }
}

// Função auxiliar para fechar modais
function fecharModal() {
    const modal = document.getElementById('infoModal');
    if (modal) modal.classList.remove('show');
}

// ===== SISTEMA DE LOGOUT =====
async function logout() {
    try {
        const response = await fetch('../api/logout.php');
        const data = await response.json();
        
        if (data.success) {
            alert('Logout realizado com sucesso!');
            window.location.href = '../index.html';
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        window.location.href = '../index.html';
    }
}
