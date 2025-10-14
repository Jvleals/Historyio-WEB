// ===== CONTROLES DA SIDEBAR =====
// Abre e fecha o menu lateral
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Alterna entre modo escuro e claro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // Salva a preferência do usuário no navegador
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Atualiza o ícone do botão
    const darkModeBtn = document.querySelector('.sidebar-content button:nth-child(2)');
    if (isDarkMode) {
        darkModeBtn.innerHTML = '<i class="fas fa-sun me-2"></i>Modo Claro';
    } else {
        darkModeBtn.innerHTML = '<i class="fas fa-moon me-2"></i>Modo Escuro';
    }
}

// ===== SISTEMA DE MODAIS INFORMATIVOS =====
// Exibe informações sobre os modos de jogo
function showInfo(type) {
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    
    // Define o conteúdo baseado no tipo de informação
    if (type === 'fato') {
        title.textContent = 'Fato do Dia';
        content.textContent = 'Você deve acertar as respostas para gerar uma ofensiva, não deixe sua ofensiva morrer';
    } else if (type === 'ilimitado') {
        title.textContent = 'Modo Ilimitado';
        content.textContent = 'Uma série infinita de perguntas e respostas de história do brasil que irá lhe dar pontos';
    } else {
        title.textContent = 'Sobre o History.io';
        content.textContent = 'Este jogo foi criado por alunos da FATEC Itapetininga, com objetivo de auxiliar o ensino de história do Brasil';
    }
    
    modal.classList.add('show');
}

// Fecha o modal
function closeModal() {
    const modal = document.getElementById('infoModal');
    modal.classList.remove('show');
}

// Fechar modal clicando fora dele
window.addEventListener('click', function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target === modal) {
        closeModal();
    }
});

// ===== INICIALIZAÇÃO DA PÁGINA =====
// Executa quando a página termina de carregar
document.addEventListener('DOMContentLoaded', function() {
    // Restaura a preferência de modo escuro salva
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
        // Atualiza o ícone do botão
        const darkModeBtn = document.querySelector('.sidebar-content button:nth-child(2)');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '<i class="fas fa-sun me-2"></i>Modo Claro';
        }
    }
    
    // Verifica se o usuário está logado e atualiza o menu
    checkLoginStatus();
    
    // Configura os botões de informação (i) dos modos de jogo
    document.querySelectorAll('.info').forEach(infoBtn => {
        // Remove o evento inline para evitar conflitos
        infoBtn.removeAttribute('onclick');
        
        // Adiciona o evento de clique corretamente
        infoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Identifica qual modo de jogo foi clicado
            const buttonGroup = this.closest('.button-group');
            const buttonText = buttonGroup.querySelector('.game-mode').textContent.trim();
            
            // Mostra a informação correspondente
            if (buttonText.includes('FATO DO DIA')) {
                showInfo('fato');
            } else if (buttonText.includes('MODO ILIMITADO')) {
                showInfo('ilimitado');
            }
        });
    });
});

// ===== CONTROLE DE SESSÃO =====
// Verifica se o usuário está logado e atualiza o menu
async function checkLoginStatus() {
    try {
        const response = await fetch('api/checkSession.php');
        const data = await response.json();
        
        const menuNotLoggedIn = document.getElementById('menuNotLoggedIn');
        const menuLoggedIn = document.getElementById('menuLoggedIn');
        
        // Mostra ou esconde os menus baseado no status de login
        if (data.logged_in) {
            if (menuNotLoggedIn) menuNotLoggedIn.style.display = 'none';
            if (menuLoggedIn) menuLoggedIn.style.display = 'block';
        } else {
            if (menuNotLoggedIn) menuNotLoggedIn.style.display = 'block';
            if (menuLoggedIn) menuLoggedIn.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
    }
}

// Desloga o usuário da página principal
async function logoutFromIndex() {
    try {
        const response = await fetch('api/logout.php');
        const data = await response.json();
        
        if (data.success) {
            alert('Logout realizado com sucesso!');
            checkLoginStatus(); // Atualiza o menu
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}