function togglePainel(url) {
    var painelButton = event.target.closest('.painel-central-de-sup');
    var existingIframe = painelButton.nextElementSibling && painelButton.nextElementSibling.tagName === 'IFRAME';
    
    if (existingIframe) {
        painelButton.nextElementSibling.remove();
    } else {
        var iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = "80%";
        iframe.style.height = "600px";
        iframe.frameBorder = "0";
        painelButton.insertAdjacentElement('afterend', iframe);
    }
}
