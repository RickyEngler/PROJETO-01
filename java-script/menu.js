// Função para alternar a exibição do menu
function toggleMenu() {
    var menu = document.getElementById('profileMenu');
    menu.classList.toggle('active');
}

// Fecha o menu se clicar fora dele
window.onclick = function(event) {
    if (!event.target.matches('.profile-button')) {
        var menu = document.getElementById('profileMenu');
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
        }
    }
}