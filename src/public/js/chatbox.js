document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("sendBtn");
    const chatMessages = document.getElementById("chat-messages");

    function addMessage(sender, text) {
        const messageElement = document.createElement("div");
        messageElement.classList.add(sender === "Você" ? "user-message" : "bot-message");
        messageElement.innerHTML = `<b>${sender}:</b> ${text}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessageToRasa(message) {
        fetch("http://localhost:5005/webhooks/rest/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: "user", message: message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                data.forEach(msg => addMessage("LILY AI", msg.text));
            } else {
                addMessage("LILY AI", "Desculpe, não entendi sua pergunta.");
            }
        })
        .catch(error => {
            console.error("Erro ao conectar com Rasa:", error);
            addMessage("LILY AI", "❌ Erro na conexão com o chatbot.");
        });
    }

    sendBtn.addEventListener("click", function () {
        const query = chatInput.value.trim();
        if (query !== "") {
            addMessage("Você", query);
            sendMessageToRasa(query);
            chatInput.value = "";
        }
    });

    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendBtn.click();
        }
    });
});
