document.getElementById('open-register').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o comportamento padrão do link
    document.getElementById('register-popup').style.display = 'flex'; // Exibe o pop-up
});

document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('register-popup').style.display = 'none'; // Oculta o pop-up
});

// Fechar o pop-up ao clicar fora do conteúdo
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('register-popup')) {
        document.getElementById('register-popup').style.display = 'none';
    }
});