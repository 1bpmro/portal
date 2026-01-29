const user = JSON.parse(sessionStorage.getItem("usuario"));
let listaEfetivo = JSON.parse(sessionStorage.getItem("lista_efetivo"));
let dadosAtuaisExibidos = []; 

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

    const dadosOrdenados = [...dados].sort((a, b) => {
        const chaves = Object.keys(a);
        if (criterio === "antiguidade") {
            // Coluna A (Índice 0)
            let antA = parseFloat(a["ANTIGUIDADE"] || a[chaves[0]] || 9999);
            let antB = parseFloat(b["ANTIGUIDADE"] || b[chaves[0]] || 9999);
            return antA - antB;
        } else {
            // Coluna C (Índice 2 - Nome Completo)
            let nomeA = (a["NOME COMPLETO"] || a[chaves[2]] || "").toString().toUpperCase();
            let nomeB = (b["NOME COMPLETO"] || b[chaves[2]] || "").toString().toUpperCase();
            return nomeA.localeCompare(nomeB);
        }
    });

    dadosOrdenados.forEach(mil => {
        const card = document.createElement('div');
        card.className = 'militar-card';
        const matricula = mil["MATRÍCULA"] || mil[Object.keys(mil)[1]]; 
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

// --- PESQUISA E FILTRO DE LOCAL ---
function filtrar() {
    if (!listaEfetivo) return;

    const termo = document.getElementById('busca').value.toLowerCase().trim();
    const localSelecionado = document.getElementById('filtro-local').value;

    const filtrados = listaEfetivo.filter(mil => {
        // Filtro por LOCAL (Coluna da Planilha)
        const matchLocal = localSelecionado === "" || (mil["LOCAL"] || "").toString().toUpperCase() === localSelecionado;

        // Pesquisa por Nome, Guerra ou Matrícula
        const matchTexto = (mil["NOME GUERRA"] || "").toString().toLowerCase().includes(termo) || 
                           (mil["NOME COMPLETO"] || "").toString().toLowerCase().includes(termo) ||
                           (mil["MATRÍCULA"] || "").toString().toLowerCase().includes(termo);

        return matchLocal && matchTexto;
    });

    renderizarCards(filtrados);
}

function ordenarEfetivo() {
    renderizarCards(dadosAtuaisExibidos);
}

// --- ATUALIZAR / SINCRONIZAR DADOS ---
async function atualizarDados() {
    const btn = document.querySelector('.btn-refresh');
    btn.innerText = "⌛";
    
    try {
        const response = await fetch(CONFIG.URL_GAS + "?action=getEfetivo");
        const novosDados = await response.json();
        
        if (novosDados) {
            sessionStorage.setItem("lista_efetivo", JSON.stringify(novosDados));
            listaEfetivo = novosDados;
            renderizarCards(novosDados);
            alert("Lista atualizada com sucesso!");
        }
    } catch (e) {
        alert("Erro ao conectar com a planilha.");
    } finally {
        btn.innerText = "🔄";
    }
}

// --- MODAL E CADASTRO ---
function abrirModalNovo() { document.getElementById('modalNovoMilitar').style.display = 'flex'; }
function fecharModal() { document.getElementById('modalNovoMilitar').style.display = 'none'; }

async function salvarNovoMilitar() {
    const nome = document.getElementById('novo-nome').value.trim();
    const grad = document.getElementById('novo-grad').value;
    const mat = document.getElementById('novo-mat').value.trim();
    const btn = document.getElementById('btnSalvarNovo');

    if (!nome || !mat) return alert("Preencha Nome e Matrícula.");

    btn.disabled = true;
    btn.innerText = "Salvando...";

    const dadosMilitar = {
        "NOME COMPLETO": nome,
        "GRADUAÇÃO": grad,
        "MATRÍCULA": mat,
        "NOME GUERRA": nome.split(" ")[0].toUpperCase(),
        "SITUAÇÃO": "ATIVO",
        "LOCAL": "P1" // Local padrão ao cadastrar
    };

    try {
        const response = await fetch(CONFIG.URL_GAS, {
            method: 'POST',
            body: JSON.stringify({ action: "createMilitar", dados: dadosMilitar })
        });
        const res = await response.json();
        if (res.success) {
            alert("Cadastrado! Atualize a lista no botão 🔄.");
            fecharModal();
        }
    } catch (e) {
        alert("Erro ao salvar.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Salvar Cadastro";
    }
}

function abrirFicha(matricula) {
    sessionStorage.setItem("matricula_selecionada", matricula);
    window.location.href = "ficha.html";
}

function logout() {
    if(confirm("Sair do sistema?")) {
        sessionStorage.clear();
        window.location.href = "../index.html";
    }
}
