const API_URL = "https://script.google.com/macros/s/AKfycbzIUrJ0t8UqLrhzzEjZS6nf8FrryMJFCJA8a6F74LN9bSvyI-7SbpuyG-BgjGp9Hn-n0w/exec";

async function fazerLogin() {
    const matricula = document.getElementById('matricula').value;
    const senha = document.getElementById('senha').value;
    const btn = document.querySelector('button');

    if (!matricula || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    btn.innerText = "Carregando...";
    btn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ matricula, senha })
        });

        const result = await response.json();

        if (result.success) {
            // Esconde login e mostra o álbum
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('album-container').classList.remove('hidden');
            document.getElementById('boas-vinda').innerText = `Bem-vindo, Nível: ${result.user.nivel}`;
            
            renderizarAlbum(result.data);
        } else {
            alert("Erro: " + result.message);
            btn.innerText = "Entrar";
            btn.disabled = false;
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com o servidor.");
        btn.innerText = "Entrar";
        btn.disabled = false;
    }
}

function renderizarAlbum(militares) {
    const container = document.getElementById('album');
    container.innerHTML = ""; // Limpa o carregando

    militares.forEach(mil => {
        const card = document.createElement('div');
        card.className = 'militar-card';
        // Usando os nomes exatos das colunas da sua planilha EFETIVO
        card.onclick = () => window.open(mil["LINK_FICHA"], "_blank");

        card.innerHTML = `
            <div class="foto-perfil"></div>
            <span class="graduacao">${mil["GRADUAÇÃO"]}</span>
            <span class="nome-guerra">${mil["NOME GUERRA"]}</span>
            <small style="color: #666; display:block;">${mil["LOCAL"]}</small>
        `;
        container.appendChild(card);
    });
}
