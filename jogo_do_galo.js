function iniciarJogo(modo) {
    // Salva o modo escolhido (opcional, caso vá usar depois)
    window.modoDeJogo = modo;

    // Oculta o menu e mostra o tabuleiro
    document.getElementById('menu-inicial').style.display = 'none';
    document.getElementById('tabuleiro').style.display = 'grid';

    // Aqui você pode definir lógica específica para cada modo
    if (modo === 'cpu') {
        console.log("Modo contra a CPU ativado");
    } else {
        console.log("Modo 1x1 ativado");
    }
}
