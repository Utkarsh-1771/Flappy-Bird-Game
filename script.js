let score = 0;
let birdPosition = 50;
let isRunning = false;
let pipePosition = 0;
let pipes = [];
let gameLoop;
let velocity = 0;
const bird = document.querySelector(".bird");
const scoreDisplay = document.querySelector("#score");
const start = document.querySelector("#start-button");
const restart = document.querySelector("#restart-button");
bird.style.top = birdPosition + "px";
const playground = document.querySelector(".playground");
function createPipe() {
    const gapHeight = 150;
    const minGapTop = 50;
    const maxGapTop = playground.offsetHeight - 50 - gapHeight - minGapTop;
    const gapTop = Math.random() * (maxGapTop - minGapTop) + minGapTop;
    const topPipe = document.createElement("div");
    topPipe.classList.add("pipe");
    topPipe.style.top = "0px";
    topPipe.style.height = gapTop + "px";
    topPipe.style.right = "0px";
    playground.appendChild(topPipe);
    const bottomPipe = document.createElement("div");
    bottomPipe.classList.add("pipe");
    bottomPipe.style.bottom = "50px";
    bottomPipe.style.height = (playground.offsetHeight - 50 - gapTop - gapHeight) + "px";
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

start.addEventListener("click", function () {
    start.style.display = "none";
    isRunning = true;
    startGameLoop();
    scoreDisplay.textContent = "0";
});
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && isRunning) {
        event.preventDefault();
        // birdPosition = birdPosition - 40;
        velocity = -8;              
        bird.style.top = birdPosition + "px";
        if (birdPosition < 0)
            birdPosition = 0;
        if (birdPosition > playground.offsetHeight - 50 - 50)
            birdPosition = playground.offsetHeight - 50 - 50;
        bird.style.top = birdPosition + "px";
    }
});
function startGameLoop() {
    gameLoop = setInterval(() => {
        // birdPosition = birdPosition + 5;
        // bird.style.top = birdPosition + "px";
        birdPosition = birdPosition + 1.5;
        velocity += 0.5;
        birdPosition += velocity;
        if (birdPosition < 0)
            birdPosition = 0;
        if (birdPosition > playground.offsetHeight - 50 - 50)
            birdPosition = playground.offsetHeight - 50 - 50;
        bird.style.top = birdPosition + "px";
        pipes.forEach((pipe) => {
            pipe.position += 5;
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
        if (birdPosition >= playground.offsetHeight - 50 - 50) {
            hit = true;
        }
        if (hit) {
            isRunning = false;
            clearInterval(gameLoop);
            restart.style.display = "block";
        }
    }, 20);
}
restart.addEventListener("click", function () {
    score = 0;
    scoreDisplay.textContent = 0;
    birdPosition = 50;
    bird.style.top = birdPosition + "px";
    pipes.forEach((pipe) => {
        pipe.top.remove();
        pipe.bottom.remove();
    });
    pipes = [];
    isRunning = true;
    restart.style.display = "none";
    startGameLoop();
});

setInterval(() => {
    if (isRunning) {
        createPipe();
    }
}, 2000);
