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
        content.textContent = 'Neste modo, você recebe um fato histórico interessante por dia. Volte amanhã para descobrir um novo fato!';
    } else if (type === 'ilimitado') {
        title.textContent = 'Modo Ilimitado';
        content.textContent = 'Teste seus conhecimentos históricos com perguntas ilimitadas sobre diversos períodos e eventos históricos. Perfect para maratonas de estudo!';
    } else {
        title.textContent = 'Sobre o History.io';
        content.textContent = 'History.io é um quiz educativo de história desenvolvido para estudantes. Explore e aprenda sobre os eventos históricos mais importantes de forma divertida e moderna!';
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
        darkModeBtn.innerHTML = '<i class="fas fa-sun me-2"></i>Modo Claro';
    }
    
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

// Adicione estas funções ao seu interatividade.js

// Verificar estado de login
function checkLoginStatus() {
    const userData = localStorage.getItem('user_data');
    const userStatus = document.getElementById('userStatus');
    const guestStatus = document.getElementById('guestStatus');
    
    if (userData) {
        const user = JSON.parse(userData);
        document.getElementById('userName').textContent = user.username;
        userStatus.classList.remove('d-none');
        guestStatus.classList.add('d-none');
        
        // Atualizar sidebar para usuário logado
        updateSidebarForLoggedUser();
    } else {
        userStatus.classList.add('d-none');
        guestStatus.classList.remove('d-none');
        
        // Sidebar padrão para visitantes
        updateSidebarForGuest();
    }
}

// Atualizar sidebar para usuário logado
function updateSidebarForLoggedUser() {
    const sidebarContent = document.querySelector('.sidebar-content');
    sidebarContent.innerHTML = `
        <button onclick="showInfo('app')"><i class="fas fa-info-circle me-2"></i>Informações</button>
        <button onclick="toggleDarkMode()"><i class="fas fa-moon me-2"></i>Modo Escuro/Claro</button>
        <button onclick="window.location.href='user/perfil.html'"><i class="fas fa-user me-2"></i>Meu Perfil</button>
        <button onclick="window.location.href='user/ranking.html'"><i class="fas fa-trophy me-2"></i>Ranking</button>
        <button onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Sair</button>
    `;
}

// Atualizar sidebar para visitante
function updateSidebarForGuest() {
    const sidebarContent = document.querySelector('.sidebar-content');
    sidebarContent.innerHTML = `
        <button onclick="showInfo('app')"><i class="fas fa-info-circle me-2"></i>Informações</button>
        <button onclick="toggleDarkMode()"><i class="fas fa-moon me-2"></i>Modo Escuro/Claro</button>
        <button onclick="window.location.href='user/login.html'"><i class="fas fa-sign-in-alt me-2"></i>Fazer Login</button>
        <button onclick="window.location.href='user/cadastro.html'"><i class="fas fa-user-plus me-2"></i>Criar Conta</button>
        <button onclick="window.location.href='user/ranking.html'"><i class="fas fa-trophy me-2"></i>Ranking</button>
    `;
}

// Função de logout
function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    checkLoginStatus();
    mostrarModal('Logout realizado com sucesso!', 'Até logo!');
}

// Função para mostrar modal (se não existir)
function mostrarModal(mensagem, titulo = 'Informação') {
    // Implementação similar à que já temos no user.js
    const modal = document.getElementById('infoModal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    
    modalContent.textContent = mensagem;
    modalTitle.textContent = titulo;
    modal.classList.add('show');
}

// No DOMContentLoaded, adicione:
document.addEventListener('DOMContentLoaded', function() {
    // Código existente...
    checkLoginStatus(); // Verificar estado de login
});