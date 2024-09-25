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

function redirecionarParaDownload() {
    // Obtém o valor do campo de entrada
    var unidadeInput = document.getElementById('unidade').value;

    // Mapeia os valores das unidades para URLs de download
    var downloadLinks = {
        'UPA Dorotéia': 'https://drive.google.com/file/d/1cXGpmIzC11O8sHgSkhOn_mfpf3gtpCGh/view?usp=sharing'
    };

    // Verifica se o valor do input corresponde a algum link de download
    if (downloadLinks[unidadeInput]) {
        // Redireciona o usuário para o link de download
        window.open(downloadLinks[unidadeInput], '_blank');
        return false; // Impede o envio do formulário padrão
    } else {
        alert('Por favor, selecione uma unidade válida.');
        return false;
    }
}