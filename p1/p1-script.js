// 1. Variáveis globais carregadas do sessionStorage
const user = JSON.parse(sessionStorage.getItem("usuario")); // Ajustado para "usuario" conforme o login
const listaEfetivo = JSON.parse(sessionStorage.getItem("lista_efetivo"));

document.addEventListener("DOMContentLoaded", function() {
    // 2. Proteção de Rota: Se não houver usuário ou lista, volta para o login
    if (!user || !listaEfetivo) {
        console.warn("Sessão inválida ou lista vazia. Redirecionando...");
        window.location.href = "../index.html";
        return;
    }

    // 3. Saudação na Barra Superior
    const labelUsuario = document.getElementById('usuario-logado');
    if (labelUsuario) {
        labelUsuario.innerText = `P1 - Olá, ${user.nomeGuerra || 'Administrador'}`;
    }

    // 4. Renderização Inicial
    renderizarCards(listaEfetivo);
});

/**
 * Cria a grade de militares na tela
 * @param {Array} dados - Lista de objetos dos militares
 */
function renderizarCards(dados) {
    const container = document.getElementById('container-cards');
    if (!container) return;
    
    container.innerHTML = "";

    // Ordenação básica por antiguidade (se existir o campo) ou nome
    const dadosOrdenados = [...dados].sort((a, b) => {
        return (a["ANTIGUID."] || 999) - (b["ANTIGUID."] || 999);
    });

    dadosOrdenados.forEach(mil => {
        const card = document.createElement('div');
        card.className = 'militar-card';
        
        // Armazena a matrícula para o clique
        const matricula = mil["MATRÍCULA"];
        card.onclick = () => abrirFicha(matricula);

        const linkFoto = mil["FOTO"] && mil["FOTO"] !== "" 
            ? mil["FOTO"] 
            : "https://cdn-icons-png.flaticon.com/512/1053/1053244.png";

        card.innerHTML = `
            <div class="foto-container">
                <img src="${linkFoto}" alt="Militar ${matricula}" loading="lazy" 
                     onerror="this.src='https://cdn-icons-png.flaticon.com/512/1053/1053244.png'">
            </div>
            <div class="militar-info">
                <span class="graduacao">${mil["GRADUAÇÃO"] || ""}</span>
                <span class="nome-guerra">${mil["NOME GUERRA"] || "SEM NOME"}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Filtra os cards em tempo real
 */
function filtrar() {
    if (!listaEfetivo) return;

    const termo = document.getElementById('busca').value.toLowerCase().trim();
    
    const filtrados = listaEfetivo.filter(mil => {
        const nome = (mil["NOME GUERRA"] || "").toString().toLowerCase();
        const graduacao = (mil["GRADUAÇÃO"] || "").toString().toLowerCase();
        const matricula = (mil["MATRÍCULA"] || "").toString().toLowerCase();
        const completo = (mil["NOME COMPLETO"] || "").toString().toLowerCase();
        
        return nome.includes(termo) || 
               graduacao.includes(termo) || 
               matricula.includes(termo) || 
               completo.includes(termo);
    });
    
    renderizarCards(filtrados);
}

/**
 * Prepara a transição para a ficha detalhada
 */
function abrirFicha(matricula) {
    if(!matricula) {
        alert("Erro: Matrícula não identificada neste card.");
        return;
    }
    // Salva a escolha para a página ficha.html
    sessionStorage.setItem("matricula_selecionada", matricula);
    window.location.href = "ficha.html";
}

/**
 * Encerra a sessão
 */
function logout() {
    if(confirm("Deseja realmente sair do sistema P1?")) {
        sessionStorage.clear();
        window.location.href = "../index.html";
    }
}
