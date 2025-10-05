// user.js - Sistema simplificado
const API_BASE = '../api/';

// Funções compartilhadas
function mostrarErro(mensagem) {
    alert(mensagem);
}

function salvarUsuario(user) {
    localStorage.setItem('user_id', user.id);
    localStorage.setItem('username', user.username);
}

// CADASTRO
if (window.location.pathname.includes('cadastro.html')) {
    document.getElementById('formCadastro').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        try {
            const response = await fetch(API_BASE + 'register.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                salvarUsuario(data.user || {id: 1, username: formData.get('username')});
                window.location.href = 'perfil.html';
            } else {
                mostrarErro(data.error);
            }
        } catch (error) {
            mostrarErro('Erro de conexão');
        }
    });
}

// LOGIN
if (window.location.pathname.includes('login.html')) {
    document.getElementById('formLogin').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        try {
            const response = await fetch(API_BASE + 'login.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                salvarUsuario(data.user);
                window.location.href = 'perfil.html';
            } else {
                mostrarErro(data.error);
            }
        } catch (error) {
            mostrarErro('Erro de conexão');
        }
    });
}

// PERFIL
if (window.location.pathname.includes('perfil.html')) {
    async function carregarPerfil() {
        const userId = localStorage.getItem('user_id');
        const username = localStorage.getItem('username');
        
        if (!userId) {
            window.location.href = 'login.html';
            return;
        }
        
        document.getElementById('userName').textContent = username;
        
        try {
            const response = await fetch(API_BASE + 'get_user_stats.php');
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('ofensivaAtual').textContent = data.stats.ofensiva_atual;
                document.getElementById('recordeOfensiva').textContent = data.stats.recorde_ofensiva;
                document.getElementById('pontosDiarios').textContent = data.stats.pontos_diarios;
                document.getElementById('pontosIlimitados').textContent = data.stats.pontos_ilimitados;
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }
    
    function sair() {
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }
    
    window.sair = sair;
    document.addEventListener('DOMContentLoaded', carregarPerfil);
}

// Verificar login em páginas protegidas
if (window.location.pathname.includes('perfil.html') || 
    window.location.pathname.includes('ranking.html')) {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
        window.location.href = 'login.html';
    }
}