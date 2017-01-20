var canvas;
var context;
var stackX = []; //for holding previous x value points.
var stackY = []; //for holding previous y value points.
var currX = 0;
var currY = 0;

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

$(document).ready(init());

function measureDistance(a, b){
  return Math.sqrt(Math.pow((a.x-b.x),2) + Math.pow((a.y-b.y),2));
}

function Point(x, y){
  this.x = x;
  this.y = y;
}

function computeJM(){
  //we have the stackx and stacky arrays to help find the convex hull.
  var pointArray = [];
  //now add the points into the array, and then sort.
  for(var i=stackX.length-1; i>=0; i--){
    pointArray.push(new Point(stackX[i], stackY[i]));
  }
  //now sort in descending order.
  /*pointArray.sort(function(a,b){
    if(a.x<b.x)
      return b.x-a.x;
    return a.x-b.x;
  });
  */
  //now we perform the jarvis march algorithm!
  //1. get leftmost point.
  //to get leftmost point, just keep a variable min that tracks the leftmost point
  var left = pointArray[0].x;
  var leftIndex = 0;
  for(var i=1; i<pointArray.length; i++){
    if(pointArray[i].x<left)
      left = pointArray[i].x;
      leftIndex = i;
  }

  //the leftmost point is at the ith position. yasss
  //now we compare this ith point to every other to find the smallest exterior angle.
  //as can be seen here:
  //https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Jarvis_march
  //_convex_hull_algorithm_diagram.svg/280px-Jarvis_march_convex_hull_algorithm_diagram.svg.png
  var previousPoint = new Point(0, pointArray[leftIndex].y);
  var startPoint = pointArray[leftIndex];
  var currentPoint = pointArray[leftIndex];
  var nextPoint;
  var currentPointIndex;
  //prepare a variable that constantly changes.
  var exteriorAngle, firstSide, secondSide, thirdSide;
  var convexHullArray = [];
  convexHullArray.push(startPoint);

  while((convexHullArray.length===1 || convexHullArray[0]!==convexHullArray[convexHullArray.length-1])){
    var maxExtAngle = 360;
    var currentExtAngle = 0;
    for(var i=0; i<pointArray.length; i++){
      if(i===currentPointIndex)
        continue;
      else{
        //now we do math to find the exterior angle, law of cosines is our friend here
        firstSide = measureDistance(previousPoint, currentPoint);
        secondSide = measureDistance(currentPoint, pointArray[i]);
        thirdSide = measureDistance(previousPoint, pointArray[i]);
        console.log(((360*Math.pow(thirdSide,2)) - Math.pow(secondSide,2) - Math.pow(firstSide,2))/(-2*secondSide*firstSide));
        currentExtAngle = 360*Math.acos(((Math.pow(thirdSide,2)) - Math.pow(secondSide,2) - Math.pow(firstSide,2))/(-2*secondSide*firstSide));
        //console.log(currentExtAngle);
        if(currentExtAngle<maxExtAngle){
          currentPointIndex = i;
          maxExtAngle = currentExtAngle;
        }
        console.log(currentPointIndex);
      }
    }
    //push the point onto convexhullarray
    convexHullArray.push(pointArray[currentPointIndex]);
    //also update current point.
    previousPoint.x = currentPoint.x;
    previousPoint.y = currentPoint.y;
    currentPoint = pointArray[currentPointIndex];

  }

  console.log(convexHullArray);

  return;
}
