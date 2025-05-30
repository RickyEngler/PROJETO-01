document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('sendBtn');
    const messages = document.getElementById('chat-messages');

    function addMessage(content, sender) {
        const div = document.createElement('div');
        div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        div.textContent = content;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    async function enviarMensagem() {
        const texto = input.value.trim();
        if (!texto) return;

        addMessage(texto, 'user');
        input.value = '';

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: texto })
            });
            const data = await res.json();
            addMessage(data.reply, 'bot');
        } catch (err) {
            console.error('Erro:', err);
            addMessage('Erro ao se comunicar com o servidor.', 'bot');
        }
    }

    sendBtn.addEventListener('click', enviarMensagem);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensagem();
    });
});
