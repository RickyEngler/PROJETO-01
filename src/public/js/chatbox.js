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

    // Função para processar o texto da consulta utilizando compromise.js
    function processQuery(query) {
        let doc = nlp(query);  // Cria um objeto de análise linguística com o texto da consulta
        let terms = doc.terms().out('array');  // Extrai as palavras-chave
        return terms.join(" ");  // Retorna as palavras-chave em uma string
    }

    function searchConfluence(query) {
        fetch(`/api/confluence-search?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                let result = "Nenhum artigo encontrado.";
                if (data.results && data.results.length > 0) {
                    result = "Encontrei isso no Confluence 🔍<br><br>";
                    data.results.forEach(item => {
                        result += `
                        <div class="search-item">
                            <a href="https://libertyti.atlassian.net/wiki${item._links.webui}" target="_blank">
                                ${item.title}
                            </a>
                        </div>`;
                    });
                }
                addMessage("LILY AI", result);
            })
            .catch(error => {
                addMessage("LILY AI", "❌ Erro ao buscar no Confluence.");
                console.error(error);
            });
    }


    sendBtn.addEventListener("click", function () {
        const query = chatInput.value.trim();
        if (query !== "") {
            addMessage("Você", query);
            const processedQuery = processQuery(query); 
            searchConfluence(processedQuery); 
            chatInput.value = "";
        }
    });

    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendBtn.click();
        }
    });
});
