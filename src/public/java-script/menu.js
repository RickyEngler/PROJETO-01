let btnMenu = document.getElementById ('btn-menu-f')
let menu = document.getElementById ('menu-mobile')
let overlay = document.getElementById ('menu-overlay')

btnMenu.addEventListener('click', ()=>{
    menu.classList.add('abrir-menu')
});

menu.addEventListener('click', ()=>{
    menu.classList.remove('abrir-menu')
});

overlay.addEventListener('click', ()=>{
    menu.classList.remove('abrir-menu')
});


// Seleciona o item do menu que contém o submenu
document.getElementById("hovermenu").addEventListener("click", function(event) {
    event.preventDefault(); // Evita o comportamento padrão do link
  
    // Alterna a classe 'active' no elemento pai (li)
    const parentLi = this.parentElement;
    parentLi.classList.toggle("active");
  });