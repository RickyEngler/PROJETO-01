
document.getElementById("openPopupBtn").addEventListener("click", function() {
    document.getElementById("popupForm").style.display = "flex";
});

document.getElementById("closePopupBtn").addEventListener("click", function() {
    document.getElementById("popupForm").style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("popupForm")) {
        document.getElementById("popupForm").style.display = "none";
    }
});

function logar() {
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;

    // Fazendo uma requisição ao backend para autenticação
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, senha: senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.href = "home.html"; // Redireciona para a página home.html se o login for bem-sucedido
        } else {
            alert('Usuário e/ou senha incorretos');
        }
    })
    .catch(error => {
        console.error('Erro ao tentar logar:', error);
        alert('Erro no servidor. Tente novamente mais tarde.');
    });
}

function cadastrarUsuario() {
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var cpf = document.getElementById('cpf').value;
    var cargo = document.getElementById('cargo').value;
    var senha = document.getElementById('senha').value;

    // Fazendo a requisição ao backend
    fetch('/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, email: email, cpf: cpf, cargo: cargo, senha: senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro no servidor. Tente novamente mais tarde.');
    });
}


app.post('/cadastrar', (req, res) => {
    const { nome, email, cpf, cargo, senha } = req.body;

    // Verifique se todos os campos foram recebidos
    if (!nome || !email || !cpf || !cargo || !senha) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    // Insere o usuário no banco de dados
    const sql = 'INSERT INTO pessoas (nome, email, cpf, cargo, senha) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, email, cpf, cargo, senha], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
        }
        return res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    });
});

document.getElementById("openPopupBtn").addEventListener("click", function() {
    document.getElementById("popupForm").style.display = "flex";
});

document.getElementById("closePopupBtn").addEventListener("click", function() {
    document.getElementById("popupForm").style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("popupForm")) {
        document.getElementById("popupForm").style.display = "none";
    }
});

function logar() {
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;

    // Fazendo uma requisição ao backend para autenticação
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, senha: senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.href = "home.html"; // Redireciona para a página home.html se o login for bem-sucedido
        } else {
            alert('Usuário e/ou senha incorretos');
        }
    })
    .catch(error => {
        console.error('Erro ao tentar logar:', error);
        alert('Erro no servidor. Tente novamente mais tarde.');
    });
}