// Faz uma requisição para o backend para buscar os dados do banco
fetch('/dados')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('data');
        data.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `ID: ${item.id}, Nome: ${item.nome}`;
            container.appendChild(div);
        });
    })
    .catch(error => console.error('Erro ao buscar os dados:', error));