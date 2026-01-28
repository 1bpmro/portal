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

    // 3. Atualiza o nome na barra superior (usando o campo da aba CONTROLE_ACESSO)
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
        
        // Usando a matrícula para abrir a ficha futuramente
        card.onclick = () => abrirFicha(mil["MATRÍCULA"]);

        // Busca a foto na coluna "FOTO" (coluna AN)
        const linkFoto = mil["FOTO"] || "https://cdn-icons-png.flaticon.com/512/1053/1053244.png";

        // Monta o visual do card respeitando os nomes das colunas da sua planilha
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

// Função de busca (filtra por nome, graduação ou matrícula)
function filtrar() {
    if (!listaEfetivo) return;

    const termo = document.getElementById('busca').value.toLowerCase();
    
    const filtrados = listaEfetivo.filter(mil => {
        // Mapeamos os campos exatos da sua planilha para a busca
        const n = (mil["NOME GUERRA"] || "").toString().toLowerCase();
        const g = (mil["GRADUAÇÃO"] || "").toString().toLowerCase();
        const m = (mil["MATRÍCULA"] || "").toString().toLowerCase();
        
        return n.includes(termo) || g.includes(termo) || m.includes(termo);
    });
    
    renderizarCards(filtrados);
}

// Função para abrir a ficha detalhada
function abrirFicha(matricula) {
    if(!matricula) {
        alert("Matrícula não encontrada para este militar.");
        return;
    }
    // Salva a matrícula para ser usada na página de detalhes
    sessionStorage.setItem("matricula_selecionada", matricula);
    
    // Alerta temporário antes de criarmos o arquivo ficha.html
    alert("Abrindo ficha da matrícula: " + matricula);
    
    // Descomente a linha abaixo quando criarmos a página ficha.html
    // window.location.href = "ficha.html";
}
