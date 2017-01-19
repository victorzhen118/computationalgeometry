var canvas;
var context;
var stackX = []; //for holding previous x value points.
var stackY = []; //for holding previous y value points.
var currX = 0;
var currY = 0;
$(document).ready(init());

function init(){
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  canvas.addEventListener("mousedown", function(e){
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;
    stackX.push(currX);
    stackY.push(currY);

    var radius = 1;
    context.beginPath();
    context.arc(currX, currY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'black';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#000000';
    context.stroke();
  });
}

function clear(){
  stackX = [];
  stackY = [];
  context.clearRect(0,0,canvas.width, canvas.height);
}
