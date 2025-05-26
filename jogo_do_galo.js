let jogadorAtual = 'X';
let jogadorHumano = 'X';
let jogadorCPU = 'O';

function iniciarJogo(modo) {
    window.modoDeJogo = modo;
    document.getElementById('menu-inicial').style.display = 'none';

    if (modo === 'cpu') {
        document.getElementById('escolher-peca').style.display = 'block';
    } else {
        // Início imediato do modo 1x1
        jogadorAtual = 'X';
        document.getElementById('tabuleiro').style.display = 'grid';
    }
}

function escolherPeca(peca) {
    jogadorHumano = peca;
    jogadorCPU = peca === 'X' ? 'O' : 'X';
    jogadorAtual = jogadorHumano;

    document.getElementById('escolher-peca').style.display = 'none';
    document.getElementById('tabuleiro').style.display = 'grid';

    console.log(`Jogador escolheu: ${jogadorHumano}, CPU será: ${jogadorCPU}`);
}

function marcar(event) {
    const casa = event.target;

    if (casa.textContent !== '-') return;

    casa.textContent = jogadorAtual;

    if (window.modoDeJogo === 'cpu' && jogadorAtual === jogadorHumano) {
        jogadorAtual = jogadorCPU;
        setTimeout(jogadaCPU, 500);
    } else {
        jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
    }
}

function jogadaCPU() {
    const casas = document.querySelectorAll('.casa');
    const livres = Array.from(casas).filter(casa => casa.textContent === '-');

    if (livres.length === 0) return;

    const escolha = livres[Math.floor(Math.random() * livres.length)];
    escolha.textContent = jogadorCPU;

    jogadorAtual = jogadorHumano;
}
