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

// --- RENDERIZAÇÃO ---
function renderizarCards(dados) {
    const container = document.getElementById('container-cards');
    if (!container) return;
    container.innerHTML = "";

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

// --- CONTROLE DO MODAL ---
function abrirModalNovo() {
    document.getElementById('modalNovoMilitar').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalNovoMilitar').style.display = 'none';
    // Limpa os campos ao fechar
    document.getElementById('novo-nome').value = "";
    document.getElementById('novo-mat').value = "";
}

// --- SALVAR NOVO MILITAR (CONECTADO AO MODAL) ---
async function salvarNovoMilitar() {
    const nome = document.getElementById('novo-nome').value.trim();
    const grad = document.getElementById('novo-grad').value;
    const mat = document.getElementById('novo-mat').value.trim();
    const btn = document.getElementById('btnSalvarNovo');

    if (!nome || !mat) {
        alert("Por favor, preencha o Nome e a Matrícula.");
        return;
    }

    // Feedback visual de carregamento
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
            alert("Militar cadastrado com sucesso!");
            fecharModal();
            // Dica: Chame sua função de atualizar dados aqui se quiser que apareça na hora
            if (typeof atualizarDados === "function") atualizarDados();
        } else {
            alert("Erro ao salvar: " + res.message);
        }
    } catch (e) {
        console.error(e);
        alert("Erro de conexão com o servidor.");
    } finally {
        btn.disabled = false;
        btn.innerText = "Salvar Cadastro";
    }
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

// --- NAVEGAÇÃO ---
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
