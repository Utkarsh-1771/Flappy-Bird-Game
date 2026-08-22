let score=0;
let birdPosition=50;
let isRunning=false;
const bird=document.querySelector(".bird");
const scoreDisplay=document.querySelector("#score");
const start=document.querySelector("#start-button");
const restart=document.querySelector("#restart-button");
bird.style.top=birdPosition+"px";
start.addEventListener("click", function()
{
    start.style.display="none";
    isRunning=true;
    scoreDisplay.textContent="0";
});
document.addEventListener("keydown",function(event)
{
    if(event.code==="Space" && isRunning)
    {
        event.preventDefault();
        birdPosition=birdPosition-40;
        bird.style.top=birdPosition+"px";
    }
});
setInterval(() => {
   birdPosition=birdPosition+2;
   bird.style.top=birdPosition+"px";
}, 20);