let score = 0;
let birdPosition = 150;
let isRunning = false;
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
const spawnInterval = isMobile ? 2250 : 2800;
const gameOver = document.querySelector(".game-over");
const finalScore = document.querySelector("#final-score");
const bird = document.querySelector(".bird");
const scoreDisplay = document.querySelector("#score");
const start = document.querySelector("#start-button");
const restart = document.querySelector("#restart-button");
bird.style.top = birdPosition + "px";
const playground = document.querySelector(".playground");
const pipeWidth = isMobile ? 46 : 70;
const initialGap = isMobile ? 150 : 185;
const minGap = isMobile ? 115 : 140;

function currentGap() {
    return Math.max(initialGap - score * 1.5, minGap);
}

function placePipe(pipe) {
    const t = `translateX(${pipe.x}px)`;
    pipe.top.style.transform = t;
    pipe.bottom.style.transform = t;
}

function createPipe() {
    const gap = currentGap();
    const H = playground.clientHeight;
    const margin = 60;
    const prev = pipes.length ? pipes[pipes.length - 1].gapTop : H / 2 - gap / 2;
    const maxShift = H * 0.45;
    const lo = Math.max(margin, prev - maxShift);
    const hi = Math.min(H - gap - margin, prev + maxShift);
    const gapTop = lo + Math.random() * Math.max(hi - lo, 0);

    const top = document.createElement("div");
    top.className = "pipe pipe-top";
    top.style.height = gapTop + "px";
    top.style.width = pipeWidth + "px";

    const bottom = document.createElement("div");
    bottom.className = "pipe pipe-bottom";
    bottom.style.top = gapTop + gap + "px";
    bottom.style.height = H - gapTop - gap + "px";
    bottom.style.width = pipeWidth + "px";

    playground.insertBefore(top, bird);
    playground.insertBefore(bottom, bird);
    const pipe = { top, bottom, x: playground.clientWidth, gapTop, gap, scored: false };
    placePipe(pipe);
    pipes.push(pipe);
}

function clearPipes() {
    pipes.forEach((p) => {
        p.top.remove();
        p.bottom.remove();
    });
    pipes = [];
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
        velocity = isMobile ? -5 : -7;
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
        velocity += isMobile ? 0.3 : 0.5;
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
            pipe.x -= pipeSpeed;
            placePipe(pipe);
        });
        pipes = pipes.filter((pipe) => {
            if (pipe.x < -pipeWidth - 20) {
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
    clearPipes();
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