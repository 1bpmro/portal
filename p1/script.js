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
    container.innerHTML = ""; // Limpa o "Carregando..."

    militares.forEach(mil => {
        const card = document.createElement('div');
        card.className = 'militar-card';
        
        // Lógica do clique: só abre se tiver link, senão avisa.
        card.onclick = () => {
            const link = mil["LINK_FICHA"];
            if (link && link.trim() !== "" && link.startsWith("http")) {
                window.open(link, "_blank");
            } else {
                alert(`A ficha de ${mil["NOME GUERRA"]} ainda não foi digitalizada pela P1.`);
            }
        };

        // Gerando o HTML do card
        card.innerHTML = `
            <div class="foto-perfil">
                <span style="font-size: 40px; line-height: 120px;">👤</span>
            </div>
            <span class="graduacao">${mil["GRADUAÇÃO"]}</span>
            <span class="nome-guerra">${mil["NOME GUERRA"]}</span>
            <small style="color: #d4af37; display:block; font-size: 10px; margin-top: 5px;">
                ${mil["LOCAL"]}
            </small>
        `;
        container.appendChild(card);
    });
}
    });
}
