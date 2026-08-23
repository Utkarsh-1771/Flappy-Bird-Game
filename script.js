let score = 0;
let birdPosition = 50;
let isRunning = false;
let pipePosition=0;
const bird = document.querySelector(".bird");
const scoreDisplay = document.querySelector("#score");
const start = document.querySelector("#start-button");
const restart = document.querySelector("#restart-button");
bird.style.top = birdPosition + "px";
const playground = document.querySelector(".playground");
const newPipe=document.createElement("div");
newPipe.classList.add("pipe");
playground.appendChild(newPipe);
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
    birdPosition = birdPosition + 2;
    bird.style.top = birdPosition + "px";
    if (birdPosition < 0)
        birdPosition = 0;
    if (birdPosition > playground.offsetHeight - 50 - 50)
        birdPosition = playground.offsetHeight - 50 - 50;
    bird.style.top = birdPosition + "px";
    pipePosition+=3;
    newPipe.style.right=pipePosition+"px";
}, 20);
