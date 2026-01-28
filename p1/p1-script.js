// 1. Verifica se o usuário está logado ao abrir a página
const usuario = JSON.parse(sessionStorage.getItem("militar_logado"));
const efetivo = JSON.parse(sessionStorage.getItem("lista_efetivo"));

if (!usuario) {
    window.location.href = "../index.html"; // Se não logou, chuta pra fora
} else {
    document.getElementById('boas-vendas').innerText = `P1 - Olá, ${usuario.nomeGuerra}`;
    renderizarCards(efetivo);
}

function renderizarCards(lista) {
    const container = document.getElementById('album-efetivo');
    container.innerHTML = ""; // Limpa o container

    lista.forEach(mil => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Link da foto: se estiver vazio na planilha, usa uma imagem padrão
        const fotoUrl = mil.FOTO || "https://via.placeholder.com/200x250?text=SEM+FOTO";

        card.innerHTML = `
            <img src="${fotoUrl}" alt="${mil.NOME_GUERRA}" class="foto-militar">
            <div class="info-militar">
                <span class="graduacao">${mil.GRADUACAO || ""}</span>
                <span class="nome-guerra">${mil.NOME_GUERRA || ""}</span>
                <small style="display:block; color:#666; margin-top:5px;">${mil.MATRICULA || ""}</small>
            </div>
        `;
        container.appendChild(card);
    });
}

function filtrar() {
    const termo = document.getElementById('busca').value.toLowerCase();
    const filtrados = efetivo.filter(mil => 
        mil.NOME_GUERRA.toLowerCase().includes(termo) || 
        mil.GRADUACAO.toLowerCase().includes(termo)
    );
    renderizarCards(filtrados);
}
