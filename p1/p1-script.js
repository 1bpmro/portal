// 1. Declaramos as variáveis no topo para que todas as funções consigam acessar os dados
const user = JSON.parse(sessionStorage.getItem("militar_logado"));
const listaEfetivo = JSON.parse(sessionStorage.getItem("lista_efetivo"));

// Aguarda o HTML carregar completamente antes de rodar o script
document.addEventListener("DOMContentLoaded", function() {
    // 2. Verifica se o usuário está logado
    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    // 3. Atualiza o nome na barra superior
    const labelUsuario = document.getElementById('usuario-logado');
    if (labelUsuario) {
        labelUsuario.innerText = `P1 - Olá, ${user.nomeGuerra || 'ADMIN'}`;
    }

    // 4. Renderiza os cards iniciais se a lista existir
    if (listaEfetivo) {
        renderizarCards(listaEfetivo);
    } else {
        console.error("Lista de efetivo não encontrada no sessionStorage.");
    }
});

// Função que cria os cards na tela
function renderizarCards(dados) {
    const container = document.getElementById('container-cards');
    if (!container) return;
    
    container.innerHTML = "";

    dados.forEach(mil => {
        const card = document.createElement('div');
        card.className = 'militar-card';
        
        // Clique para abrir a ficha
        card.onclick = () => abrirFicha(mil["MATRÍCULA"]);

        const linkFoto = mil["FOTO"] || "https://cdn-icons-png.flaticon.com/512/1053/1053244.png";

        card.innerHTML = `
            <div class="foto-container">
                <img src="${linkFoto}" alt="Foto de ${mil["NOME GUERRA"]}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1053/1053244.png'">
            </div>
            <div class="militar-info">
                <span class="graduacao">${mil["GRADUAÇÃO"] || ""}</span>
                <span class="nome-guerra">${mil["NOME GUERRA"] || "NÃO CADASTRADO"}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função de busca
function filtrar() {
    if (!listaEfetivo) return;

    const termo = document.getElementById('busca').value.toLowerCase();
    
    const filtrados = listaEfetivo.filter(mil => {
        const n = (mil["NOME GUERRA"] || "").toString().toLowerCase();
        const g = (mil["GRADUAÇÃO"] || "").toString().toLowerCase();
        const m = (mil["MATRÍCULA"] || "").toString().toLowerCase();
        
        return n.includes(termo) || g.includes(termo) || m.includes(termo);
    });
    
    renderizarCards(filtrados);
}

// Função para abrir a ficha detalhada - ATIVADA!
function abrirFicha(matricula) {
    if(!matricula) {
        alert("Matrícula não encontrada.");
        return;
    }
    // Salva a matrícula para a próxima página saber quem carregar
    sessionStorage.setItem("matricula_selecionada", matricula);
    
    // Redireciona para a página da ficha
    window.location.href = "ficha.html";
}
