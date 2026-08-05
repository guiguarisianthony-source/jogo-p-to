let playerName = "";
let score = 0;
let gameInterval;
let memeTriggered = false; // Garante que o vídeo toque só 1 vez por rodada

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
    // Limpa os patos da tela
    river.innerHTML = "";
    // Volta para a tela inicial
    screenGame.classList.remove("active");
    screenName.classList.add("active");
    inputName.value = "";
});

// Iniciar Spawn dos Patos
function startGame() {
    score = 0;
    memeTriggered = false;
    updateScore();
    gameInterval = setInterval(spawnDuck, 900);
}

function stopGame() {
    clearInterval(gameInterval);
}

function updateScore() {
    displayScore.textContent = `Pontos: ${score}`;

    // Dispara o vídeo do meme 67 quando atingir ou ultrapassar 67 pontos
    if (score >= 67 && !memeTriggered) {
        memeTriggered = true;
        playMemeVideo();
    }
}

// Lógica para tocar o vídeo rápido do meme 67
function playMemeVideo() {
    memeModal.classList.add("active");
    memeVideo.currentTime = 0;
    memeVideo.play().catch(e => console.log("Erro ao reproduzir vídeo:", e));

    // Fecha o vídeo automaticamente após 3 segundos (meme rápido)
    setTimeout(() => {
        memeVideo.pause();
        memeModal.classList.remove("active");
    }, 3000);
}

// Lógica de Geração de Patos
function spawnDuck() {
    const duck = document.createElement("div");
    duck.classList.add("duck");
    duck.textContent = "🦆";

    const rand = Math.random();
    let points = 1;
    let speed = Math.random() * 2 + 3;

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
        speed = Math.random() * 1.5 + 1.5;
    }

    const topPosition = Math.random() * 70 + 15;
    duck.style.top = `${topPosition}%`;
    duck.style.animationDuration = `${speed}s`;

    duck.addEventListener("mousedown", () => {
        score += points;
        updateScore();
        duck.remove();
    });

    duck.addEventListener("animationend", () => {
        duck.remove();
    });

    river.appendChild(duck);
}
