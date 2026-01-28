const API_URL = "https://script.google.com/macros/s/AKfycbzIUrJ0t8UqLrhzzEjZS6nf8FrryMJFCJA8a6F74LN9bSvyI-7SbpuyG-BgjGp9Hn-n0w/exec";

async function autenticar() {
    const mat = document.getElementById('matricula').value;
    const sen = document.getElementById('senha').value;
    const msg = document.getElementById('mensagem-erro');
    const btn = document.querySelector('button');

    if (!mat || !sen) {
        msg.innerText = "Preencha matrícula e senha.";
        return;
    }

    // Visual de carregamento
    btn.innerText = "Autenticando...";
    btn.disabled = true;
    msg.innerText = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ matricula: mat, senha: sen })
        });

        const result = await response.json();
        console.log("Resposta do Google:", result);

        if (result.success) {
            msg.style.color = "#1a5c37";
            msg.innerText = "Acesso autorizado! Redirecionando...";

            // Salva os dados na memória do navegador para usar nas outras páginas
            sessionStorage.setItem("militar_logado", JSON.stringify(result.user));
            sessionStorage.setItem("lista_efetivo", JSON.stringify(result.data));

            // REDIRECIONAMENTO INTELIGENTE
            setTimeout(() => {
                if (result.user.nivel === "ADMIN" || result.user.nivel === "P1") {
                    window.location.href = "p1/index.html";
                } else {
                    // Se for militar padrão, mandaremos para uma página de ficha individual (que criaremos)
                    alert("Acesso padrão: Em breve sua ficha individual estará disponível aqui.");
                    btn.disabled = false;
                    btn.innerText = "Acessar Sistema";
                }
            }, 1000);

        } else {
            msg.style.color = "#d9534f";
            msg.innerText = "Matrícula ou senha incorretos.";
            btn.disabled = false;
            btn.innerText = "Acessar Sistema";
        }
    } catch (error) {
        console.error(error);
        msg.innerText = "Erro na conexão com o servidor.";
        btn.disabled = false;
        btn.innerText = "Acessar Sistema";
    }
}
