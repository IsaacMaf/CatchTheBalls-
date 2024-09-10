// Selecionar elementos
const rectangle = document.getElementById('rectangle');
const gameArea = document.getElementById('game-area');
const scoreElement = document.getElementById('score');
const streakElement = document.getElementById('streak');

// Inicializar variáveis
let score = 0;
let streak = 0;

// Função para criar uma nova forma
function createShape() {
    const shape = document.createElement('div');
    const size = Math.random() * 50 + 20; // Tamanho entre 20px e 70px
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.position = 'absolute';
    shape.style.backgroundColor = 'green';
    shape.style.borderRadius = getBorderRadius();
    shape.style.left = `${Math.random() * (gameArea.clientWidth - size)}px`;
    shape.style.top = '0px';
    gameArea.appendChild(shape);

    // Animação para a forma cair
    let dropInterval = setInterval(() => {
        const rect = shape.getBoundingClientRect();
        const gameRect = gameArea.getBoundingClientRect();
        if (rect.top + rect.height > gameRect.bottom) {
            clearInterval(dropInterval);
            gameArea.removeChild(shape);
        } else {
            shape.style.top = `${rect.top + 5}px`;
        }

        // Verificar colisão com o retângulo
        const rectPos = rectangle.getBoundingClientRect();
        if (rect.top + rect.height > rectPos.top &&
            rect.left < rectPos.left + rectPos.width &&
            rect.left + rect.width > rectPos.left) {
            score++;
            streak++;
            scoreElement.textContent = score;
            streakElement.textContent = streak;
            gameArea.removeChild(shape);
        }
    }, 20);
}

// Função para gerar bordas arredondadas aleatórias
function getBorderRadius() {
    const sides = Math.floor(Math.random() * 4) + 3; // Entre 3 e 6 arestas
    return `${(sides / 6) * 100}%`;
}

// Função para iniciar o jogo
function startGame() {
    setInterval(createShape, 2000); // Criar uma forma a cada 2 segundos
}

// Eventos de arrastar e soltar
rectangle.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text/plain', null); // Necessário para eventos de arrastar
});

rectangle.addEventListener('drag', (event) => {
    const rect = gameArea.getBoundingClientRect();
    const x = event.clientX - rect.left - rectangle.clientWidth / 2;
    rectangle.style.left = `${Math.min(Math.max(x, 0), gameArea.clientWidth - rectangle.clientWidth)}px`;
});

rectangle.addEventListener('dragend', () => {
    rectangle.style.left = `${parseFloat(rectangle.style.left)}px`;
});

// Iniciar o jogo
startGame();

