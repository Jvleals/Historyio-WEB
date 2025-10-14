function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // Salvar preferência no localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Alterar ícone conforme o modo
    const darkModeBtn = document.querySelector('.sidebar-content button:nth-child(2)');
    if (isDarkMode) {
        darkModeBtn.innerHTML = '<i class="fas fa-sun me-2"></i>Modo Claro';
    } else {
        darkModeBtn.innerHTML = '<i class="fas fa-moon me-2"></i>Modo Escuro';
    }
}

function showInfo(type) {
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    
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

// Verificar preferência de modo escuro salva
document.addEventListener('DOMContentLoaded', function() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
        // Atualizar ícone do botão
        const darkModeBtn = document.querySelector('.sidebar-content button:nth-child(2)');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '<i class="fas fa-sun me-2"></i>Modo Claro';
        }
    }
    
    // Verificar login status
    checkLoginStatus();
    
    // CORREÇÃO DO BOTÃO "i" - Remover os event listeners inline e adicionar corretamente
    document.querySelectorAll('.info').forEach(infoBtn => {
        // Remover o onclick inline
        infoBtn.removeAttribute('onclick');
        
        // Adicionar event listener correto
        infoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Determinar qual modal mostrar baseado no botão pai
            const buttonGroup = this.closest('.button-group');
            const buttonText = buttonGroup.querySelector('.game-mode').textContent.trim();
            
            if (buttonText.includes('FATO DO DIA')) {
                showInfo('fato');
            } else if (buttonText.includes('MODO ILIMITADO')) {
                showInfo('ilimitado');
            }
        });
    });
});

// Verificar estado de login usando API
async function checkLoginStatus() {
    try {
        const response = await fetch('api/checkSession.php');
        const data = await response.json();
        
        const menuNotLoggedIn = document.getElementById('menuNotLoggedIn');
        const menuLoggedIn = document.getElementById('menuLoggedIn');
        
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

// Função de logout
async function logoutFromIndex() {
    try {
        const response = await fetch('api/logout.php');
        const data = await response.json();
        
        if (data.success) {
            alert('Logout realizado com sucesso!');
            checkLoginStatus();
        }
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}