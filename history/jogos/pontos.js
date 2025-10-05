// pontos.js - Sistema de pontuação completo
const PONTOS_API = '../api/';

class SistemaPontuacao {
    
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
            
            console.log(`Enviando pontos: modo=${modo}, pontos=${pontos}, acertou=${acertou}`);
            
            const response = await fetch(PONTOS_API + 'adicionar_pontos.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            console.log('Resposta do servidor:', data);
            
            if (data.success) {
                console.log(`✅ ${pontos} pontos salvos no modo ${modo}`);
                return true;
            } else {
                console.error('❌ Erro ao salvar pontos:', data.error);
                return false;
            }
            
        } catch (error) {
            console.error('❌ Erro de conexão:', error);
            return false;
        }
    }
    
    static async acertouModoDiario() {
        return await this.adicionarPontos('diario', 10, true);
    }
    
    static async acertouModoIlimitado() {
        return await this.adicionarPontos('ilimitado', 10, true);
    }
    
    static async errouModoDiario() {
        return await this.adicionarPontos('diario', 0, false);
    }
    
    static async errouModoIlimitado() {
        return await this.adicionarPontos('ilimitado', 0, false);
    }
}