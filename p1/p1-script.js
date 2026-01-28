const usuario = JSON.parse(sessionStorage.getItem("militar_logado"));
const efetivo = JSON.parse(sessionStorage.getItem("lista_efetivo"));

if (!usuario) {
    window.location.href = "../index.html";
} else {
    document.getElementById('boas-vendas').innerText = `P1 - Olá, ${usuario.nomeGuerra}`;
    renderizarCards(efetivo);
}

function renderizarCards(lista) {
    const container = document.getElementById('album-efetivo');
    container.innerHTML = ""; 

    lista.forEach(mil => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Ajuste aqui: 'FOTO' deve ser o título exato da sua coluna AN
        const fotoUrl = mil.FOTO || "https://via.placeholder.com/200x250?text=SEM+FOTO";

        card.innerHTML = `
            <img src="${fotoUrl}" class="foto-militar">
            <div class="info">
                <span class="grad">${mil.GRADUACAO || "MILITAR"}</span>
                <span class="nome">${mil.NOME_GUERRA || "NOME"}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function filtrar() {
    const termo = document.getElementById('busca').value.toLowerCase();
    const filtrados = efetivo.filter(mil => 
        (mil.NOME_GUERRA && mil.NOME_GUERRA.toLowerCase().includes(termo)) || 
        (mil.GRADUACAO && mil.GRADUACAO.toLowerCase().includes(termo))
    );
    renderizarCards(filtrados);
}
