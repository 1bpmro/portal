// 1. Declaramos as variáveis no topo para que todas as funções (inclusive o filtrar) consigam ler
const user = JSON.parse(sessionStorage.getItem("militar_logado"));
const listaEfetivo = JSON.parse(sessionStorage.getItem("lista_efetivo"));

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

    // 4. Renderiza os cards iniciais
    if (listaEfetivo) {
        renderizarCards(listaEfetivo);
    }
});

function renderizarCards(dados) {
    const container = document.getElementById('container-cards');
    if (!container) return;
    
    container.innerHTML = "";

    dados.forEach(mil => {
        const card = document.createElement('div');
        card.className = 'militar-card';
        
        // Usando os nomes exatos da sua planilha com colchetes por causa dos espaços/acentos
        card.onclick = () => abrirFicha(mil["MATRÍCULA"]);

        // Busca a foto na última coluna "FOTO"
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

function filtrar() {
    const termo = document.getElementById('busca').value.toLowerCase();
    
    const filtrados = listaEfetivo.filter(mil => {
        // Ajustado para os nomes reais das colunas
        const n = (mil["NOME GUERRA"] || "").toString().toLowerCase();
        const g = (mil["GRADUAÇÃO"] || "").toString().toLowerCase();
        const m = (mil["MATRÍCULA"] || "").toString().toLowerCase();
        
        return n.includes(termo) || g.includes(termo) || m.includes(termo);
    });
    
    renderizarCards(filtrados);
}

function abrirFicha(matricula) {
    if(!matricula) {
        alert("Matrícula não encontrada para este militar.");
        return;
    }
    // Salvamos a matrícula selecionada para a próxima página saber quem carregar
    sessionStorage.setItem("matricula_selecionada", matricula);
    alert("Abrindo ficha da matrícula: " + matricula);
    
    // O próximo passo será criar este arquivo ficha.html
    // window.location.href = "ficha.html";
}
