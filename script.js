let score = 0;
let birdPosition = 150;
let isRunning = false;
let pipePosition = 0;
let pipes = [];
let gameLoop;
let velocity = 0;
let pipeSpawn;
const backgroundImages = ["assets/images/background_image_1.jpg", "assets/images/background_image_2.jpg", "assets/images/background_image_3.jpg"];
const bgLayer1 = document.querySelector("#bg-layer-1");
const bgLayer2 = document.querySelector("#bg-layer-2");
let activeLayer = bgLayer1;
let inactiveLayer = bgLayer2;
let currentImage = 0;
const gameContainer = document.querySelector(".game-container");
bgLayer1.style.backgroundImage = `url("${backgroundImages[currentImage]}")`;
bgLayer1.style.opacity = "1";
bgLayer2.style.opacity = "0";
setInterval(() => {
    currentImage = (currentImage + 1) % backgroundImages.length;
    inactiveLayer.style.backgroundImage = `url("${backgroundImages[currentImage]}")`;
    inactiveLayer.style.opacity = "1";
    activeLayer.style.opacity = "0";
    const temp = activeLayer;
    activeLayer = inactiveLayer;
    inactiveLayer = temp;
}, 8000);
const isMobile = window.innerWidth <= 600;
const spawnInterval = isMobile ? 2150 : 2800;
const gameOver = document.querySelector(".game-over");
const finalScore = document.querySelector("#final-score");
const bird = document.querySelector(".bird");
const scoreDisplay = document.querySelector("#score");
const start = document.querySelector("#start-button");
const restart = document.querySelector("#restart-button");
bird.style.top = birdPosition + "px";
const playground = document.querySelector(".playground");
function createPipe() {
    const gapHeight = isMobile ? 120 : 170;
    const minGapTop = 50;
    const maxGapTop = playground.offsetHeight - gapHeight - minGapTop;
    const gapTop = Math.random() * (maxGapTop - minGapTop) + minGapTop;
    const topPipe = document.createElement("div");
    topPipe.classList.add("pipe");
    topPipe.style.top = "0px";
    topPipe.style.height = gapTop + "px";
    topPipe.style.right = "0px";
    playground.appendChild(topPipe);
    const bottomPipe = document.createElement("div");
    bottomPipe.classList.add("pipe");
    bottomPipe.style.bottom = "0px";
    bottomPipe.style.height = (playground.offsetHeight - gapTop - gapHeight) + "px";
    bottomPipe.style.right = "0px";
    bottomPipe.style.top = "auto";
    playground.appendChild(bottomPipe);
    pipes.push({ top: topPipe, bottom: bottomPipe, position: 0, scored: false });
}
function isColliding(rectA, rectB) {
    return (
        rectA.left < rectB.right &&
        rectA.right > rectB.left &&
        rectA.top < rectB.bottom &&
        rectA.bottom > rectB.top
    );
}
function flap() {
    if (isRunning) {
        velocity = -7;
    }
}
start.addEventListener("click", function () {
    start.style.display = "none";
    isRunning = true;
    startGameLoop();
    scoreDisplay.textContent = "0";
});
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && isRunning) {
        event.preventDefault();
        flap();
        bird.style.top = birdPosition + "px";
        if (birdPosition < 0)
            birdPosition = 0;
        if (birdPosition > playground.offsetHeight - 35)
            birdPosition = playground.offsetHeight - 35;
        bird.style.top = birdPosition + "px";
    }
});
document.addEventListener("keydown", function (event) {
    if (start.style.display !== "none" && event.code === "Enter") {
        start.click();
    }
    else if (event.code === "Enter" && gameOver.style.display !== "none") {
        restart.click();
    }
});

playground.addEventListener("click", function () {
    flap();
});
function startGameLoop() {
    startPipeSpawn();
    gameLoop = setInterval(() => {
        velocity += 0.5;
        birdPosition += velocity;
        if (birdPosition < 0)
            birdPosition = 0;
        if (birdPosition > playground.offsetHeight - 35)
            birdPosition = playground.offsetHeight - 35;
        bird.style.top = birdPosition + "px";
        const baseSpeed = isMobile ? 3 : 5;
        const maxSpeed = isMobile ? 17 : 20;
        const pipeSpeed = Math.min(baseSpeed + score * 0.3, maxSpeed);
        pipes.forEach((pipe) => {
            pipe.position += pipeSpeed;
            pipe.top.style.right = pipe.position + "px";
            pipe.bottom.style.right = pipe.position + "px";
        });
        pipes = pipes.filter((pipe) => {
            if (pipe.position > playground.offsetWidth + 50) {
                pipe.top.remove();
                pipe.bottom.remove();
                return false;
            }
            return true;
        });
        const birdRect = bird.getBoundingClientRect();
        let hit = false;
        pipes.forEach((pipe) => {
            const topRect = pipe.top.getBoundingClientRect();
            if (!pipe.scored && topRect.right < birdRect.left) {
                score++;
                pipe.scored = true;
                scoreDisplay.textContent = score;
            }
        });
        pipes.forEach((pipe) => {
            const topRect = pipe.top.getBoundingClientRect();
            const bottomRect = pipe.bottom.getBoundingClientRect();
            if (isColliding(birdRect, topRect) || isColliding(birdRect, bottomRect)) {
                hit = true;
            }
        });
        if (birdPosition >= playground.offsetHeight - 35) {
            hit = true;
        }
        if (hit) {
            isRunning = false;
            clearInterval(gameLoop);
            gameOver.style.display = "flex";
            finalScore.textContent = score;
        }
    }, 20);
}
restart.addEventListener("click", function () {
    score = 0;
    scoreDisplay.textContent = 0;
    velocity = 0;
    birdPosition = 150;
    bird.style.top = birdPosition + "px";
    pipes.forEach((pipe) => {
        pipe.top.remove();
        pipe.bottom.remove();
    });
    pipes = [];
    isRunning = true;
    gameOver.style.display = "none";
    clearInterval(pipeSpawn);
    startGameLoop();
});
function startPipeSpawn() {
    pipeSpawn = setInterval(() => {
        if (isRunning) {
            createPipe();
        }
    }, spawnInterval);
}