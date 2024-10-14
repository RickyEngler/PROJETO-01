// Seleciona os elementos do menu
let btnMenu = document.getElementById('btn-menu-f');
let menu = document.getElementById('menu-mobile');
let overlay = document.getElementById('menu-overlay');

// Função para alternar o estado do menu
function toggleMenu() {
    menu.classList.toggle('abrir-menu');
}

// Adiciona event listeners para abrir/fechar o menu
btnMenu.addEventListener('click', toggleMenu);
menu.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Seleciona o item do menu que contém o submenu
const hoverMenu = document.getElementById("hovermenu");
if (hoverMenu) {
    hoverMenu.addEventListener("click", function(event) {
        event.preventDefault(); // Evita o comportamento padrão do link
      
        // Alterna a classe 'active' no elemento pai (li)
        const parentLi = this.parentElement;
        parentLi.classList.toggle("active");
    });
}

// Função para exibir o pop-up
function showPopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('hidden');
}

// Função para fechar o pop-up
const closeBtn = document.getElementById('close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        const popup = document.getElementById('popup');
        popup.classList.add('hidden');
    });
}
// Exemplo de simulação de recebimento de mensagem
setTimeout(showPopup, 3000); // Simula a exibição após 3 segundos
