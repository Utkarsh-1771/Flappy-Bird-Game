let score = 0;
let birdPosition = 50;
let isRunning = false;
let pipePosition = 0;
let pipes = [];
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
    pipes.push({ top: topPipe, bottom: bottomPipe, position: 0 });
}

start.addEventListener("click", function () {
    start.style.display = "none";
    isRunning = true;
    scoreDisplay.textContent = "0";
});
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && isRunning) {
        event.preventDefault();
        birdPosition = birdPosition - 40;
        bird.style.top = birdPosition + "px";
        if (birdPosition < 0)
            birdPosition = 0;
        if (birdPosition > playground.offsetHeight - 50 - 50)
            birdPosition = playground.offsetHeight - 50 - 50;
        bird.style.top = birdPosition + "px";
    }
});
setInterval(() => {
    birdPosition = birdPosition + 4;
    bird.style.top = birdPosition + "px";
    if (birdPosition < 0)
        birdPosition = 0;
    if (birdPosition > playground.offsetHeight - 50 - 50)
        birdPosition = playground.offsetHeight - 50 - 50;
    bird.style.top = birdPosition + "px";
    pipes.forEach((pipe) => {
        pipe.position += 3;
        pipe.top.style.right = pipe.position + "px";
        pipe.bottom.style.right = pipe.position + "px";
    });
}, 20);
setInterval(() => {
    if (isRunning) {
        createPipe();
    }
}, 2000);
