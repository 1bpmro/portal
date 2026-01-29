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

// --- FORMATAÇÃO DE DATAS ---
function formatarInfo(valor) {
    if (!valor || valor === "") return "";
    if (valor.toString().includes("T") && !isNaN(Date.parse(valor))) {
        const d = new Date(valor);
        return d.toLocaleDateString('pt-BR');
    }
    return valor;
}

// --- RENDERIZAÇÃO (ORDEM ALFABÉTICA PELA COLUNA C) ---
function renderizarCards(dados) {
    const container = document.getElementById('container-cards');
    if (!container) return;
    container.innerHTML = "";

    // Ordenação A-Z por Nome Completo
    const dadosOrdenados = [...dados].sort((a, b) => {
        let nomeA = (a["NOME COMPLETO"] || "").toString().toUpperCase();
        let nomeB = (b["NOME COMPLETO"] || "").toString().toUpperCase();
        return nomeA.localeCompare(nomeB);
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

// --- PESQUISA ---
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

// --- CADASTRO DE NOVO MILITAR ---
async function abrirModalNovo() {
    const nome = prompt("Nome Completo:");
    if (!nome) return;
    const graduacao = prompt("Graduação (Ex: SD, CB, SGT):");
    const matricula = prompt("Matrícula:");

    if (!matricula) return alert("A matrícula é obrigatória!");

    const dadosMilitar = {
        "NOME COMPLETO": nome,
        "GRADUAÇÃO": graduacao,
        "MATRÍCULA": matricula,
        "NOME GUERRA": nome.split(" ")[0].toUpperCase(),
        "SITUAÇÃO": "ATIVO",
        "FOTO": "" 
    };

    try {
        const response = await fetch(CONFIG.URL_GAS, {
            method: 'POST',
            body: JSON.stringify({ action: "createMilitar", dados: dadosMilitar })
        });
        const res = await response.json();
        if (res.success) {
            alert("Sucesso! Clique em OK e depois no botão 🔄 para atualizar a lista.");
        } else {
            alert("Erro: " + res.message);
        }
    } catch (e) {
        alert("Erro ao conectar com o servidor.");
    }
}

// --- NAVEGAÇÃO ---
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
