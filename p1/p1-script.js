const user = JSON.parse(sessionStorage.getItem("militar_logado"));
const listaEfetivo = JSON.parse(sessionStorage.getItem("lista_efetivo"));

if (!user) {
    window.location.href = "../index.html";
} else {
    document.getElementById('usuario-logado').innerText = `P1 - Olá, ${user.nomeGuerra || 'ADMIN'}`;
    renderizarCards(listaEfetivo);
}

function renderizarCards(dados) {
    const container = document.getElementById('container-cards');
    container.innerHTML = "";

    dados.forEach(mil => {
        // Criamos o card
        const card = document.createElement('div');
        card.className = 'militar-card';
        
        // Quando clicar no card, abre a ficha (vamos criar essa função depois)
        card.onclick = () => abrirFicha(mil.MATRICULA);

        const linkFoto = mil.FOTO || "https://cdn-icons-png.flaticon.com/512/1053/1053244.png";

        card.innerHTML = `
            <div class="foto-container">
                <img src="${linkFoto}" alt="Foto de ${mil.NOME_GUERRA}">
            </div>
            <div class="militar-info">
                <span class="graduacao">${mil.GRADUACAO || ""}</span>
                <span class="nome-guerra">${mil.NOME_GUERRA || "NÃO CADASTRADO"}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function filtrar() {
    const termo = document.getElementById('busca').value.toLowerCase();
    const filtrados = listaEfetivo.filter(mil => {
        const n = (mil.NOME_GUERRA || "").toLowerCase();
        const g = (mil.GRADUACAO || "").toLowerCase();
        const m = (mil.MATRICULA || "").toString();
        return n.includes(termo) || g.includes(termo) || m.includes(termo);
    });
    renderizarCards(filtrados);
}

function abrirFicha(matricula) {
    // Por enquanto apenas um alerta, depois faremos a página da ficha
    alert("Abrindo ficha da matrícula: " + matricula);
    // window.location.href = `ficha.html?mat=${matricula}`;
}
