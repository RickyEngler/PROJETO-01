document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("sendBtn");
    const chatMessages = document.getElementById("chat-messages");

    sendBtn.addEventListener("click", async () => {
        const pergunta = input.value.trim();
        if (!pergunta) return;

        chatMessages.innerHTML += `<div class="user-message">${pergunta}</div>`;
        input.value = "";

        const resposta = await fetch("/api/perguntar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pergunta })
        });

        const data = await resposta.json();

        chatMessages.innerHTML += `<div class="bot-message">${data.resposta.replace(/\n/g, "<br>")}</div>`;
    });
});
