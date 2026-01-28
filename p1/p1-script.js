const user = JSON.parse(sessionStorage.getItem("usuario"));
const listaEfetivo = JSON.parse(sessionStorage.getItem("lista_efetivo"));

document.addEventListener("DOMContentLoaded", function() {
    if (!user || !listaEfetivo) {
        window.location.href = "../index.html";
        return;
    }

    const labelUsuario = document.getElementById('usuario-logado');
    if (labelUsuario) {
        labelUsuario.innerText = `P1 - Olá, ${user.nomeGuerra || 'Administrador'}`;
    }

    renderizarCards(listaEfetivo);
});

// --- MELHORIA 1: Formatação de Datas (Para evitar o erro de 'ocultar' info) ---
function formatarInfo(valor) {
    if (!valor || valor === "") return "";
    
    // Se for uma data do Google Sheets (formato ISO), limpa para DD/MM/AAAA
    if (valor.toString().includes("T") && !isNaN(Date.parse(valor))) {
        const d = new Date(valor);
        return d.toLocaleDateString('pt-BR');
    }
    return valor;
}

function renderizarCards(dados) {
    const container = document.getElementById('container-cards');
    if (!container) return;
    
    container.innerHTML = "";

    const dadosOrdenados = [...dados].sort((a, b) => {
        // Garante que quem não tem antiguidade vá para o fim da fila
        let antA = parseInt(a["ANTIGUID."]) || 9999;
        let antB = parseInt(b["ANTIGUID."]) || 9999;
        return antA - antB;
    });

    dadosOrdenados.forEach(mil => {
        const card = document.createElement('div');
        card.className = 'militar-card';
        
        const matricula = mil["MATRÍCULA"];
        card.onclick = () => abrirFicha(matricula);

        const linkFoto = mil["FOTO"] && mil["FOTO"].startsWith("http") 
            ? mil["FOTO"] 
            : "https://cdn-icons-png.flaticon.com/512/1053/1053244.png";

        card.innerHTML = `
            <div class="foto-container">
                <img src="${linkFoto}" alt="Militar" loading="lazy" 
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

function filtrar() {
    if (!listaEfetivo) return;
    const termo = document.getElementById('busca').value.toLowerCase().trim();
    
    const filtrados = listaEfetivo.filter(mil => {
        return (mil["NOME GUERRA"] || "").toString().toLowerCase().includes(termo) || 
               (mil["GRADUAÇÃO"] || "").toString().toLowerCase().includes(termo) || 
               (mil["MATRÍCULA"] || "").toString().toLowerCase().includes(termo) || 
               (mil["NOME COMPLETO"] || "").toString().toLowerCase().includes(termo);
    });
    
    renderizarCards(filtrados);
}

function abrirFicha(matricula) {
    if(!matricula) return alert("Matrícula inválida.");
    sessionStorage.setItem("matricula_selecionada", matricula);
    window.location.href = "ficha.html";
}

function logout() {
    if(confirm("Deseja sair?")) {
        sessionStorage.clear();
        window.location.href = "../index.html";
    }
}
