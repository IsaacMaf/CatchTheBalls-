// Selecionar elementos
const rectangle = document.getElementById('rectangle');
const gameArea = document.getElementById('game-area');
const scoreElement = document.getElementById('score');

// aqui eu defino o tamanho da caixa onde o jogador vai poder controlar o retângulo
gameArea.style.width = `${window.innerWidth / 4.5}px`; //divide por 4.5 do tamanho original
gameArea.style.height = `${window.innerHeight * 0.8}px`; //multiplica por 0.8 do tamanho original

// lugar onde vai se iniciar as variáveis das bolinhas
let score = 0;
let dropSpeed = 5; // define a velocidade inicial
let ballCreationInterval = 2000; // define a taxa de criação delas no início
let ballCreationTimer; // um "timer" para a criação

// ajusta especificamente as medidas do retângulo
const initialRectangleWidth = 100; // esta é a largura inicial dele
const additionalWidth = 40; // este é o tanto de pixels que eu quero que aumente
rectangle.style.width = `${initialRectangleWidth + additionalWidth}px`; //e aqui é a largura final

// função que cria bolinhas
function createBall() {
    const ball = document.createElement('div'); //variável bolinha
    const size = Math.random() * 80 + 20; // aqui é um tamanho entre 20 a 100 pixels
    const ballDropSpeed = 5 * (1 - (size - 20) / 80); // e aqui ajusta a velocidade delas pelo tamanho

    ball.style.width = `${size}px`; //define a largura
    ball.style.height = `${size}px`; //define a altura
    ball.style.position = 'absolute'; //aqui é a posição da bolinha
    ball.style.backgroundColor = 'green'; // a cor de todas elas
    ball.style.borderRadius = '50%'; // "BorderRadius vai ter a função de arredondar a estrutura pra transformar numa bola"
    ball.style.left = `${Math.random() * (gameArea.clientWidth - size)}px`;
    ball.style.top = '0px';
    gameArea.appendChild(ball); //este método(appendChild) faz com que o "gameArena" herde o que tem em "ball"

    // sistema de "zigue-zague" das bolinhas e sua verificação
    const isZigzag = score >= 50 && Math.random() < 0.1; // 10% das bolinhas agora tem chance de aparecer fazendo zigue-zague

    if (isZigzag) { //se a bolinha aparecer como zigue zague, então: v v v
        let zigzagDirection = 1; // 1, no caso, vai ser a direita e o -1 vai ser a esquerda
        let zigzagAmplitude = 100; // aqui eu defini o tanto de pixels que a estrutura vai se mover no zigue-zague
        let zigzagSpeed = 2; // como o nome sugere, é a velocidade em que ela realiza o movimento, dois.
        let xOffset = 0; 

        // aqui é onde se faz a animação do zigue-zague
        const zigzagInterval = setInterval(() => { 
            const ballRect = ball.getBoundingClientRect(); //} define o intervalo para os limites
            const gameRect = gameArea.getBoundingClientRect();

            // esta parte verifica se a bolinha saiu do ponto
            if (ballRect.top + ballRect.height > gameRect.bottom) { //se "a soma"do topo da bolinha mais a sua altura forem maior que a área do jogo
                clearInterval(zigzagInterval); //zera o intervalo
                gameArea.removeChild(ball); //remove as bolas no espaço
                resetGame(); //e por fim, reinicia o jogo
            } else {
                //se não, continua o movimento aqui
                xOffset += zigzagSpeed * zigzagDirection;
                if (Math.abs(xOffset) > zigzagAmplitude) {
                    zigzagDirection *= -1; // como eu disse, o -1 vai trocar a posição da bola
                }
                ball.style.top = `${ballRect.top + ballDropSpeed - gameRect.top}px`;
                ball.style.left = `${Math.min(Math.max(ballRect.left + xOffset - gameRect.left, 0), gameArea.clientWidth - ballRect.width)}px`;
            }

            // nesta parte é verificado a colisão do retângulo controlado pelo jogador
            const rectangleRect = rectangle.getBoundingClientRect(); //cria os limites do retângulo
            if (ballRect.top + ballRect.height > rectangleRect.top &&
                ballRect.left < rectangleRect.left + rectangleRect.width &&
                ballRect.left + ballRect.width > rectangleRect.left) { //basicamente, aqui diz: se a bolinha tiver encostado no retângulo, então:
                score++; //aumenta o escore para -> escore que o jogador estava + um
                scoreElement.textContent = score; //troca para os pontos atuais
                dropSpeed += 0.1; // só aumenta a velocidade de caída das bolinhas
                
                // cria uma maior dificuldade no jogo, onde a cada bolinha capturada, o jogo aumenta a taxa de bolas, com o limite sendo 3 bolinhas por segundo
                ballCreationInterval = Math.max(333, 2000 - (score * 50));
                
                // Reinicia o intervalo de criação de bolinhas
                clearInterval(ballCreationTimer);
                startBallCreation();
                
                gameArea.removeChild(ball);
                clearInterval(zigzagInterval);
            }
        }, 20);
    } else {
        // aqui é a animação da bolinha caindo
        const dropInterval = setInterval(() => {
            const ballRect = ball.getBoundingClientRect();
            const gameRect = gameArea.getBoundingClientRect();

            // nesta parte é verificado se a bolinha saiu da área do jogo
            if (ballRect.top + ballRect.height > gameRect.bottom) {
                clearInterval(dropInterval);
                gameArea.removeChild(ball);
                resetGame(); // Reinicia o jogo
            } else {
                ball.style.top = `${ballRect.top + ballDropSpeed - gameRect.top}px`; //parte do código otmizada para usar a taxa de caída de bolas
            }

            //
            const rectangleRect = rectangle.getBoundingClientRect();
            if (ballRect.top + ballRect.height > rectangleRect.top &&
                ballRect.left < rectangleRect.left + rectangleRect.width &&
                ballRect.left + ballRect.width > rectangleRect.left) {
                score++;
                scoreElement.textContent = score;
                dropSpeed += 0.1; // Aumenta a velocidade de queda a cada ponto
                
                // Aumentar a taxa de criação de bolinhas, até o limite de 3 bolinhas por segundo
                ballCreationInterval = Math.max(333, 2000 - (score * 50));
                
                // Reinicia o intervalo de criação de bolinhas
                clearInterval(ballCreationTimer);
                startBallCreation();
                
                gameArea.removeChild(ball);
                clearInterval(dropInterval);
            }
        }, 20); //repete o procedimento no "else"
    }
}

// Função que reinicia o jogo, para quando o jogador perde
function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    dropSpeed = 5; // Velocidade inicial
    ballCreationInterval = 2000; // taxa inicial de criação de bolinhas

    // Reinicia a taxa
    clearInterval(ballCreationTimer);
    startBallCreation();
}

// Função que inicia a criação das bolas
function startBallCreation() {
    ballCreationTimer = setInterval(createBall, ballCreationInterval);
}

// Função que vai estar iniciando o jogo
function startGame() {
    startBallCreation(); // Inicia a criação das formas
}

// Eventos drag and drop
rectangle.addEventListener('mousedown', (event) => { //quando o mouse estiver pressionado
    event.preventDefault(); // Previne o comportamento padrão de arrastar, ou seja, de uma criação de um "retângulo fantasma" ao pressionar o mouse
    const gameRect = gameArea.getBoundingClientRect();
    const offsetX = event.clientX - rectangle.getBoundingClientRect().left;

    function onMouseMove(e) { 
        const newLeft = e.clientX - gameRect.left - offsetX;
        rectangle.style.left = `${Math.min(Math.max(newLeft, 0), gameArea.clientWidth - rectangle.clientWidth)}px`; //função que faz mover o retângulo somente no eixo X
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp); //função de soltar o mouse
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp); //lista os eventos
});

// Previne o comportamento de arrastar padrão ao usar o "drag and drop"(o retângulo fantasma mencionado)
rectangle.ondragstart = () => false;

// Inicia o jogo
startGame();
