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
    var usuario = document.getElementById('usuario').value.trim();
    var senha = document.getElementById('senha').value.trim();



    if(usuario == "" && senha == "") {
        location.href = "../home.html"; // Redireciona para a página home.html
    } 
    else{
        alert('Usuário e/ou senha incorretos');
    }
}

    