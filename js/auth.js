function autenticar() {
    const mat = document.getElementById('matricula').value;
    const sen = document.getElementById('senha').value;
    const msg = document.getElementById('mensagem-erro');

    if (mat === "" || sen === "") {
        msg.innerText = "Por favor, preencha todos os campos.";
        return;
    }

    // Por enquanto, vamos simular que está validando
    msg.style.color = "#55ff55";
    msg.innerText = "Validando credenciais...";
    
    console.log("Tentativa de acesso:", mat);
    // Aqui virá o fetch para o Google Apps Script
}
