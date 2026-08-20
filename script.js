let score=0;
let birdPosition=50;
let isRunning=false;
const bird=document.querySelector(".bird");
const scoreDisplay=document.querySelector("#score");
const start=document.querySelector("#start-button");
const restart=document.querySelector("#restart-button");
start.addEventListener("click", function()
{
    start.style.display="none";
    isRunning=true;
    scoreDisplay.textContent="0";
    console.log(isRunning);
});