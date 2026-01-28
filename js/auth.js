async function login() {
    const mat = document.getElementById('matricula').value;
    const sen = document.getElementById('senha').value;
    const btn = document.querySelector('.btn-login');

    if (!mat || !sen) {
        alert("Preencha todos os campos!");
        return;
    }

    // Feedback visual imediato para combater a sensação de lentidão
    btn.innerText = "🔌 Conectando...";
    btn.disabled = true;

    try {
        // Usa a URL centralizada do config.js
        const response = await fetch(CONFIG.URL_GAS, {
            method: 'POST',
            body: JSON.stringify({ matricula: mat, senha: sen })
        });

        const res = await response.json();

        if (res.success) {
            // Salva os dados do usuário e a lista do efetivo
            sessionStorage.setItem('usuario', JSON.stringify(res.user));
            sessionStorage.setItem('lista_efetivo', JSON.stringify(res.data));

            // REDIRECIONAMENTO CORRETO:
            // Se o nível for P1 ou ADMIN, ele DEVE ir para a pasta p1
            if (res.user.nivel === "P1" || res.user.nivel === "ADMIN") {
                window.location.href = "p1/index.html";
            } else {
                // Se for militar comum, vai para a ficha dele (ou portal comum)
                sessionStorage.setItem("matricula_selecionada", res.user.matricula);
                window.location.href = "p1/ficha.html"; 
            }
        } else {
            alert(res.message);
            btn.innerText = "Entrar";
            btn.disabled = false;
        }
    } catch (e) {
        console.error("Erro no login:", e);
        alert("Erro de conexão com o servidor. Verifique a URL do GAS.");
        btn.innerText = "Entrar";
        btn.disabled = false;
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "../index.html";
}
