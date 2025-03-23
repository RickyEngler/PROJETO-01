function toggleMenu() {
    var menu = document.getElementById('profileMenu');
    menu.classList.toggle('active');
}

window.onclick = function(event) {
    if (!event.target.matches('.profile-button')) {
        var menu = document.getElementById('profileMenu');
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
        }
    }
}

function redirecionarParaDownload() {
    var unidadeInput = document.getElementById('unidade').value;

    var downloadLinks = {
        'UPA Dorotéia': 'https://drive.google.com/file/d/1cXGpmIzC11O8sHgSkhOn_mfpf3gtpCGh/view?usp=sharing'
    };

    if (downloadLinks[unidadeInput]) {
        window.open(downloadLinks[unidadeInput], '_blank');
        return false;
    } else {
        alert('Por favor, selecione uma unidade válida.');
        return false;
    }
}