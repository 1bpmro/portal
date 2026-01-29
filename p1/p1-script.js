const user = JSON.parse(sessionStorage.getItem("usuario"));
const listaEfetivo = JSON.parse(sessionStorage.getItem("lista_efetivo"));
let dadosAtuaisExibidos = []; // Variável para controlar a ordenação em cima dos filtros

document.addEventListener("DOMContentLoaded", function() {
    if (!user || !listaEfetivo) {
        window.location.href = "../index.html";
        return;
    }

    const labelUsuario = document.getElementById('usuario-logado');
    if (labelUsuario) {
        labelUsuario.innerText = `P1 - Olá, ${user.nomeGuerra || 'Administrador'}`;
    }

    // Inicializa a lista
    renderizarCards(listaEfetivo);
});

// --- RENDERIZAÇÃO COM LÓGICA DE ORDENAÇÃO ---
function renderizarCards(dados) {
    dadosAtuaisExibidos = dados; 
    const container = document.getElementById('container-cards');
    if (!container) return;
    container.innerHTML = "";

    const criterio = document.getElementById('ordenacao').value;

    // LÓGICA DE ORDENAÇÃO
    const dadosOrdenados = [...dados].sort((a, b) => {
        if (criterio === "antiguidade") {
            // Pega o valor da 1ª coluna (índice 0) ou da chave "ANTIGUIDADE"
            const chaves = Object.keys(a);
            let antA = parseFloat(a["ANTIGUIDADE"] || a[chaves[0]] || 9999);
            let antB = parseFloat(b["ANTIGUIDADE"] || b[chaves[0]] || 9999);
            return antA - antB;
        } else {
            // Pega o valor da 3ª coluna (índice 2) ou da chave "NOME COMPLETO"
            const chaves = Object.keys(a);
            let nomeA = (a["NOME GUERRA"] || a[chaves[2]] || "").toString().toUpperCase();
            let nomeB = (b["NOME GUERRA"] || b[chaves[2]] || "").toString().toUpperCase();
            return nomeA.localeCompare(nomeB);
        }
    });

    dadosOrdenados.forEach(mil => {
        const card = document.createElement('div');
        card.className = 'militar-card';
        const matricula = mil["MATRÍCULA"] || mil[Object.keys(mil)[1]]; // Tenta matrícula pelo nome ou 2ª coluna
        card.onclick = () => abrirFicha(matricula);

        const linkFoto = mil["FOTO"] && mil["FOTO"].startsWith("http") 
            ? mil["FOTO"] : "https://cdn-icons-png.flaticon.com/512/1053/1053244.png";

        card.innerHTML = `
            <div class="foto-container">
                <img src="${linkFoto}" alt="Militar" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1053/1053244.png'">
            </div>
            <div class="militar-info">
                <span class="graduacao">${mil["GRADUAÇÃO"] || ""}</span>
                <span class="nome-guerra">${mil["NOME GUERRA"] || "SEM NOME"}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- PESQUISA E FILTRO DE SEÇÃO COMBINADOS ---
function filtrar() {
    if (!listaEfetivo) return;

    const termo = document.getElementById('busca').value.toLowerCase().trim();
    const secaoSelecionada = document.getElementById('filtro-secao').value;

    const filtrados = listaEfetivo.filter(mil => {
        // Verifica Seção (se o campo da seção estiver vazio no select, ignora o filtro)
        const matchSecao = secaoSelecionada === "" || (mil["SEÇÃO"] || "").toString().toUpperCase() === secaoSelecionada;

        // Verifica Texto (Nome, Matrícula, Graduação)
        const matchTexto = (mil["NOME GUERRA"] || "").toString().toLowerCase().includes(termo) || 
                           (mil["NOME COMPLETO"] || "").toString().toLowerCase().includes(termo) ||
                           (mil["MATRÍCULA"] || "").toString().toLowerCase().includes(termo) ||
                           (mil["GRADUAÇÃO"] || "").toString().toLowerCase().includes(termo);

        return matchSecao && matchTexto;
    });

    renderizarCards(filtrados);
}

// Disparado quando muda apenas o select de ordenação
function ordenarEfetivo() {
    renderizarCards(dadosAtuaisExibidos);
}

// --- CONTROLE DO MODAL ---
function abrirModalNovo() {
    document.getElementById('modalNovoMilitar').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalNovoMilitar').style.display = 'none';
    document.getElementById('novo-nome').value = "";
    document.getElementById('novo-mat').value = "";
}

// --- SALVAR NOVO MILITAR ---
async function salvarNovoMilitar() {
    const nome = document.getElementById('novo-nome').value.trim();
    const grad = document.getElementById('novo-grad').value;
    const mat = document.getElementById('novo-mat').value.trim();
    const btn = document.getElementById('btnSalvarNovo');

    if (!nome || !mat) {
        alert("Por favor, preencha o Nome e a Matrícula.");
        return;
    }

    btn.disabled = true;
    btn.innerText = "Enviando...";

    const dadosMilitar = {
        "NOME COMPLETO": nome,
        "GRADUAÇÃO": grad,
        "MATRÍCULA": mat,
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
            alert("Militar cadastrado com sucesso! Clique no botão 🔄 para atualizar sua lista local.");
            fecharModal();
        } else {
            alert("Erro: " + res.message);
        }
    } catch (e) {
        alert("Erro de conexão com o servidor.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Salvar Cadastro";
    }
}

// --- NAVEGAÇÃO E OUTROS ---
function abrirFicha(matricula) {
    if(!matricula) return alert("Matrícula não encontrada.");
    sessionStorage.setItem("matricula_selecionada", matricula);
    window.location.href = "ficha.html";
}

function logout() {
    if(confirm("Deseja encerrar a sessão?")) {
        sessionStorage.clear();
        window.location.href = "../index.html";
    }
}
