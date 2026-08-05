let playerName = "";
let score = 0;
let gameInterval;
let memeTriggered = false;

// Referências das Telas
const screenName = document.getElementById("screen-name");
const screenStart = document.getElementById("screen-start");
const screenGame = document.getElementById("screen-game");

// Elementos de UI
const inputName = document.getElementById("player-name");
const btnNext = document.getElementById("btn-next");
const btnStart = document.getElementById("btn-start");
const btnClose = document.getElementById("btn-close");
const welcomeMessage = document.getElementById("welcome-message");
const displayPlayer = document.getElementById("display-player");
const displayScore = document.getElementById("display-score");
const river = document.getElementById("river");

// Modal de Vídeo
const memeModal = document.getElementById("meme-modal");
const memeVideo = document.getElementById("meme-video");

// Avançar da Tela 1 para a Tela 2
btnNext.addEventListener("click", () => {
    const nameValue = inputName.value.trim();
    if (nameValue === "") {
        alert("Por favor, digite seu nome!");
        return;
    }
    playerName = nameValue;
    welcomeMessage.textContent = `Olá, ${playerName}!`;
    
    screenName.classList.remove("active");
    screenStart.classList.add("active");
});

// Avançar da Tela 2 para o Jogo
btnStart.addEventListener("click", () => {
    screenStart.classList.remove("active");
    screenGame.classList.add("active");
    
    displayPlayer.textContent = `Jogador: ${playerName}`;
    startGame();
});

// Botão "X" para Sair do Jogo
btnClose.addEventListener("click", () => {
    stopGame();
    river.innerHTML = ""; // Limpa todos os patos
    screenGame.classList.remove("active");
    screenName.classList.add("active");
    inputName.value = "";
});

// Iniciar Spawn de Patos Estáticos
function startGame() {
    score = 0;
    memeTriggered = false;
    updateScore();
    // Um novo pato surge a cada 250 milissegundos (ajuste se achar muito rápido/lento)
    gameInterval = setInterval(spawnDuck, 250);
}

function stopGame() {
    clearInterval(gameInterval);
}

function updateScore() {
    displayScore.textContent = `Pontos: ${score}`;

    // Dispara o vídeo do meme quando atingir 67 pontos ou mais
    if (score >= 67 && !memeTriggered) {
        memeTriggered = true;
        playMemeVideo();
    }
}

// Reproduz o vídeo na tela inteira de forma rápida (Mantido)
function playMemeVideo() {
    memeModal.classList.add("active");
    memeVideo.currentTime = 0;
    memeVideo.play().catch(e => console.log("Erro ao reproduzir vídeo:", e));

    // Esconde o vídeo após 2.5 segundos
    setTimeout(() => {
        memeVideo.pause();
        memeModal.classList.remove("active");
    }, 2500);
}

// Lógica de Geração de Patos Estáticos em Posições Aleatórias
function spawnDuck() {
    const duck = document.createElement("div");
    duck.classList.add("duck");
    duck.textContent = "🦆";

    const rand = Math.random();
    let points = 1;
    // Tempo que o pato fica na tela (segundos)
    let duration = Math.random() * 1 + 2; // Entre 2 e 3 segundos

    // Definir tipo do pato (Mantido)
    if (rand < 0.5) {
        duck.classList.add("yellow");
        points = 1;
    } else if (rand < 0.75) {
        duck.classList.add("red");
        points = 2;
    } else if (rand < 0.9) {
        duck.classList.add("blue");
        points = 5;
    } else {
        duck.classList.add("rgb");
        points = 10;
        duration = Math.random() * 0.5 + 1.2; // Pato RGB some mais rápido
    }

    // NOVA LÓGICA DE POSICIONAMENTO:
    // Posição vertical aleatória (5% a 85% para não colar nas bordas)
    const topPosition = Math.random() * 80 + 5;
    // Posição horizontal aleatória (5% a 90%)
    const leftPosition = Math.random() * 85 + 5;

    duck.style.top = `${topPosition}%`;
    duck.style.left = `${leftPosition}%`;
    
    // Aplica a duração da animação CSS (surgir e sumir)
    duck.style.animationDuration = `${duration}s`;

    // Clique no Pato (Clique rápido antes que suma)
    duck.addEventListener("mousedown", () => {
        score += points;
        updateScore();
        // Animação visual rápida de clique antes de remover
        duck.style.transform = "scale(1.3)";
        duck.style.opacity = "0";
        // Remove do DOM após a micro animação de clique
        setTimeout(() => duck.remove(), 100);
    });

    // Remove o pato automaticamente quando a animação CSS terminar (ele sumiu)
    duck.addEventListener("animationend", () => {
        // Verifica se o pato ainda está no rio (não foi clicado)
        if (duck.parentNode === river) {
            duck.remove();
        }
    });

    river.appendChild(duck);
}
