
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
    var email = document.getElementById('login-email').value;
    var senha = document.getElementById('login-senha').value;

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
            location.href = "../views/home.html";
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
    var nome = document.getElementById('cadastro-nome').value;
    var email = document.getElementById('cadastro-email').value;
    var cpf = document.getElementById('cadastro-cpf').value;
    var cargo = document.getElementById('cadastro-cargo').value;
    var senha = document.getElementById('cadastro-senha').value;

    fetch('/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, email: email, cpf: cpf, cargo: cargo, senha: senha })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro no servidor. Tente novamente mais tarde.');
    });
}


document.getElementById('cadastro-cpf').addEventListener('input', function(e) {
    let cpf = e.target.value.replace(/\D/g, '');
    
    if (cpf.length > 11) {
        cpf = cpf.substring(0, 11);
    }

    // Formata o CPF
    if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3');
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    e.target.value = cpf;
});
