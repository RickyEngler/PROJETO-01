function togglePainel(url) {
    var frame = document.getElementById('painel-frame');
    if (frame.style.display === 'block' && frame.src === url) {
        frame.style.display = 'none';
        frame.src = '';
    } else {
        frame.style.display = 'block';
        frame.src = url;
    }
}
