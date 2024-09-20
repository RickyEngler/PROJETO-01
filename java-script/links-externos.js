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

 // Referência ao select
const unidadeSelect = document.getElementById('unidadeSelect');

// Função que exibe o item selecionado e oculta os outros
unidadeSelect.addEventListener('change', function() {
// Oculta todos os elementos de informações
document.querySelectorAll('[id^="info-"]').forEach(function(div) {
   div.classList.add('hidden');
});

// Pega o valor selecionado
const selectedValue = unidadeSelect.value;

// Exibe o conteúdo correspondente
const selectedInfo = document.getElementById(`info-${selectedValue}`);
if (selectedInfo) {
   selectedInfo.classList.remove('hidden');
}
});