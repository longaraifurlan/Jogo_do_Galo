let tabuleiro = [
    ['-', '-', '-'],
    ['-', '-', '-'],
    ['-', '-', '-']
];


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
    document.getElementById('escolher-peca').style.display = 'none';
    document.getElementById('escolher-dificuldade').style.display = 'block';

}

let dificuldadeCPU = 'facil'; // padrão

function escolherDificuldade(nivel) {
    dificuldadeCPU = nivel;
    document.getElementById('escolher-dificuldade').style.display = 'none';
    document.getElementById('tabuleiro').style.display = 'grid';
    
    // Se CPU começa
    if (jogadorCPU === 'X') {
        jogadorAtual = jogadorCPU;
        setTimeout(jogadaCPU, 500);
    }
}


function marcar(event) {
    const casa = event.target;

    if (casa.textContent !== '-') return;

    casa.textContent = jogadorAtual;
    casa.classList.add(jogadorAtual);

    atualizarTabuleiro(casa.id, jogadorAtual);

    if (verificarResultado(jogadorAtual)) return;

    if (window.modoDeJogo === 'cpu' && jogadorAtual === jogadorHumano) {
        jogadorAtual = jogadorCPU;
        setTimeout(jogadaCPU, 500);
    } else {
        jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';
    }
}

function atualizarTabuleiro(id, simbolo) {
    const mapa = {
        a1: [0, 0], a2: [0, 1], a3: [0, 2],
        b1: [1, 0], b2: [1, 1], b3: [1, 2],
        c1: [2, 0], c2: [2, 1], c3: [2, 2]
    };
    const [linha, coluna] = mapa[id];
    tabuleiro[linha][coluna] = simbolo;
}


function jogadaCPU() {
    let casas = document.querySelectorAll('.casa');
    let livres = Array.from(casas).filter(casa => casa.textContent === '-');

    if (livres.length === 0) return;

    let escolha;

    if (dificuldadeCPU === 'facil') {
        escolha = livres[Math.floor(Math.random() * livres.length)];
    }

    else if (dificuldadeCPU === 'medio') {
        escolha = melhorJogadaMedia();
        if (!escolha) {
            escolha = livres[Math.floor(Math.random() * livres.length)];
        }
    }

    else if (dificuldadeCPU === 'dificil') {
        const melhor = minimax(tabuleiro, jogadorCPU);
        const id = converterCoordenadaParaId(melhor.movimento);
        escolha = document.getElementById(id);
    }

    escolha.textContent = jogadorCPU;
    escolha.classList.add(jogadorCPU);
    atualizarTabuleiro(escolha.id, jogadorCPU);

    if (verificarResultado(jogadorCPU)) return;

    jogadorAtual = jogadorHumano;
}

function melhorJogadaMedia() {
    const mapa = {
        '00': 'a1', '01': 'a2', '02': 'a3',
        '10': 'b1', '11': 'b2', '12': 'b3',
        '20': 'c1', '21': 'c2', '22': 'c3'
    };

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (tabuleiro[i][j] === '-') {
                // Testa vitória da CPU
                tabuleiro[i][j] = jogadorCPU;
                if (verificarVitoriaSimples(jogadorCPU)) {
                    tabuleiro[i][j] = '-';
                    return document.getElementById(mapa[`${i}${j}`]);
                }
                tabuleiro[i][j] = '-';

                // Testa bloqueio ao jogador
                tabuleiro[i][j] = jogadorHumano;
                if (verificarVitoriaSimples(jogadorHumano)) {
                    tabuleiro[i][j] = '-';
                    return document.getElementById(mapa[`${i}${j}`]);
                }
                tabuleiro[i][j] = '-';
            }
        }
    }

    return null;
}

function minimax(novoTabuleiro, jogador) {
    const adversario = jogador === jogadorCPU ? jogadorHumano : jogadorCPU;

    // Verifica fim de jogo
    if (verificarVitoriaSimples(jogadorCPU)) return { pontuacao: +10 };
    if (verificarVitoriaSimples(jogadorHumano)) return { pontuacao: -10 };
    if (novoTabuleiro.flat().every(cell => cell !== '-')) return { pontuacao: 0 };

    let movimentos = [];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (novoTabuleiro[i][j] === '-') {
                novoTabuleiro[i][j] = jogador;

                let resultado = minimax(novoTabuleiro, adversario);
                movimentos.push({
                    movimento: [i, j],
                    pontuacao: resultado.pontuacao
                });

                novoTabuleiro[i][j] = '-'; // desfaz o movimento
            }
        }
    }

    // Escolher o melhor movimento
    let melhor;
    if (jogador === jogadorCPU) {
        let max = -Infinity;
        for (let mov of movimentos) {
            if (mov.pontuacao > max) {
                max = mov.pontuacao;
                melhor = mov;
            }
        }
    } else {
        let min = Infinity;
        for (let mov of movimentos) {
            if (mov.pontuacao < min) {
                min = mov.pontuacao;
                melhor = mov;
            }
        }
    }

    return melhor;
}

function converterCoordenadaParaId([linha, coluna]) {
    const mapa = {
        '00': 'a1', '01': 'a2', '02': 'a3',
        '10': 'b1', '11': 'b2', '12': 'b3',
        '20': 'c1', '21': 'c2', '22': 'c3'
    };
    return mapa[`${linha}${coluna}`];
}


function verificarVitoriaSimples(jogador) {
    // Mesmo código da função verificarResultado, mas sem efeitos visuais
    for (let i = 0; i < 3; i++) {
        if (tabuleiro[i].every(cell => cell === jogador)) return true;
        if (tabuleiro.map(row => row[i]).every(cell => cell === jogador)) return true;
    }

    if (tabuleiro[0][0] === jogador && tabuleiro[1][1] === jogador && tabuleiro[2][2] === jogador) return true;
    if (tabuleiro[0][2] === jogador && tabuleiro[1][1] === jogador && tabuleiro[2][0] === jogador) return true;

    return false;
}



function verificarResultado(jogador) {
    // Verifica linhas e colunas
    for (let i = 0; i < 3; i++) {
        if (tabuleiro[i].every(cell => cell === jogador)) {
            destacarVitoria([[i, 0], [i, 1], [i, 2]]);
            mostrarResultado(mensagemVitoria(jogador));
            encerrarJogo();
            return true;
        }

        if (tabuleiro.map(row => row[i]).every(cell => cell === jogador)) {
            destacarVitoria([[0, i], [1, i], [2, i]]);
            mostrarResultado(mensagemVitoria(jogador));
            encerrarJogo();
            return true;
        }
    }

    // Verifica diagonais
    if (tabuleiro[0][0] === jogador && tabuleiro[1][1] === jogador && tabuleiro[2][2] === jogador) {
        destacarVitoria([[0, 0], [1, 1], [2, 2]]);
        mostrarResultado(mensagemVitoria(jogador));
        encerrarJogo();
        return true;
    }

    if (tabuleiro[0][2] === jogador && tabuleiro[1][1] === jogador && tabuleiro[2][0] === jogador) {
        destacarVitoria([[0, 2], [1, 1], [2, 0]]);
        mostrarResultado(mensagemVitoria(jogador));
        encerrarJogo();
        return true;
    }

    // Verifica empate
    const casas = document.querySelectorAll('.casa');
    const todasPreenchidas = Array.from(casas).every(casa => casa.textContent !== '-');
    if (todasPreenchidas) {
        mostrarResultado('Empate! Tente novamente.');
        encerrarJogo();
        return true;
    }

    return false;
}

function mensagemVitoria(jogador) {
    return jogador === jogadorHumano
        ? 'Jogador 1🙋‍♂️ venceu! Parabéns!'
        : (window.modoDeJogo === 'cpu' ? '🤖 venceu. Tente novamente!' : `Jogador 🙋‍♂️2 venceu! Parabéns!`);
}


function destacarVitoria(posicoes) {
    const mapaReverso = {
        '00': 'a1', '01': 'a2', '02': 'a3',
        '10': 'b1', '11': 'b2', '12': 'b3',
        '20': 'c1', '21': 'c2', '22': 'c3'
    };

    posicoes.forEach(([linha, coluna]) => {
        const id = mapaReverso[`${linha}${coluna}`];
        document.getElementById(id).classList.add('vitoria');
    });
}



function encerrarJogo() {
    document.querySelectorAll('.casa').forEach(casa => {
        casa.classList.add('bloqueada');
    });
}


function mostrarResultado(mensagem) {
    document.getElementById('mensagem-resultado').textContent = mensagem;
    document.getElementById('resultado').style.display = 'block';
}

function reiniciarJogo() {
    location.reload(); // Recarrega a página inteira
}


    // Reset lógica
    tabuleiro = [
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-']
    ];

    document.getElementById('tabuleiro').style.display = 'grid';
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('menu-inicial').style.display = 'block';

