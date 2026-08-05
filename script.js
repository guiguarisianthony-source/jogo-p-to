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
    river.innerHTML = "";
    screenGame.classList.remove("active");
    screenName.classList.add("active");
    inputName.value = "";
});

// Iniciar Spawn de Patos (Acelerado para aparecerem muitos patos)
function startGame() {
    score = 0;
    memeTriggered = false;
    updateScore();
    // Aparece um novo pato a cada 180 milissegundos
    gameInterval = setInterval(spawnDuck, 180);
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

// Reproduz o vídeo na tela inteira de forma rápida
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

// Lógica de Geração de Patos em Toda a Tela
function spawnDuck() {
    const duck = document.createElement("div");
    duck.classList.add("duck");
    duck.textContent = "🦆";

    const rand = Math.random();
    let points = 1;
    let speed = Math.random() * 2 + 2.5;

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
        speed = Math.random() * 1.2 + 1.2;
    }

    // Posição vertical espalhada por quase toda a tela (5% a 90%)
    const topPosition = Math.random() * 85 + 5;
    duck.style.top = `${topPosition}%`;
    duck.style.animation = `moveDuck ${speed}s linear forwards`;

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
