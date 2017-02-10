var canvas;
var context;
var stackX = []; //for holding previous x value points.
var stackY = []; //for holding previous y value points.
var currX = 0;
var currY = 0;
var colors = '0123456789ABCEDF';

/*
List of TODOS:
add link to site in the readme.md - only when done
do not allow for more dots to be drawn after first convex hull unless clear button was pressed
one degenerate edge case where the poinst are on the line. fix for jarvis march.
proper chans algorithm.
stop the buttons from being too bright.
add an icon for the page.
add a tab to the psuedocode under the analysis of algorithms

time permitted:
draw the lines during the algorithm. mad work tho
*/

function init(){
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#EEEEEE';
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = 'black';
  context.stroke();

  canvas.addEventListener("mousedown", function(e){
    currX = e.pageX - canvas.offsetLeft-6;
    currY = e.pageY - canvas.offsetTop-6;
    //currX = e.clientX;
    //currY = e.clientY;
    stackX.push(currX);
    stackY.push(currY);

    context.beginPath();
    context.arc(currX, currY, 4, 0, 2 * Math.PI, false);
    context.fillStyle = '#' + generateRandomColorString();
    context.fill();
    //context.lineWidth = 5;
    //context.strokeStyle = randomColor;
    //context.stroke();
  });
}

function generateRandomColorString(){
  var toReturn = "";
  for(var i=0; i<6; i++){
    toReturn += colors[Math.floor(Math.random()*16)];
  }
  return toReturn;
}

$(document).ready(init());

function clearScreen(){
  stackX = [];
  stackY = [];
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#EEEEEE';
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = 'black';
  context.stroke();
}

function measureDistance(a, b){
  return Math.sqrt(Math.pow((a.x-b.x),2) + Math.pow((a.y-b.y),2));
}

function Point(x, y){
  this.x = x;
  this.y = y;
}

function computeJMSetUp(){
  var pointArray = [];
  //now add the points into the array, and then sort.
  for(var i=0; i<stackX.length; i++){
    pointArray.push(new Point(stackX[i], stackY[i]));
  }
  computeJM(pointArray);
}

function computeGSSetUp(){
  var pointArray = [];
  //now add the points into the array, and then sort.
  for(var i=0; i<stackX.length; i++){
    pointArray.push(new Point(stackX[i], stackY[i]));
  }
  computeGS(pointArray);
}

function computeCASetUp(){
  var pointArray = [];
  //now add the points into the array, and then sort.
  for(var i=0; i<stackX.length; i++){
    pointArray.push(new Point(stackX[i], stackY[i]));
  }
  computeCA(pointArray);
}

function computeJM(pointArray){
  if(pointArray.length<=2)
    return;
  //we have the stackx and stacky arrays to help find the convex hull.
  /*pointArray.sort(function(a,b){
    if(a.x<b.x)
      return b.x-a.x;
    return a.x-b.x;
  });
  */
  //now we perform the jarvis march algorithm!
  //1. get leftmost point.
  //to get leftmost point, just keep a variable leftmin that tracks the leftmost point
  var left = pointArray[0].x;
  var leftIndex = 0;
  for(var i=1; i<pointArray.length; i++){
    if(pointArray[i].x<left){
      left = pointArray[i].x;
      leftIndex = i;
    }
  }

  //the leftmost point is at the ith position. yasss
  //now we compare this ith point to every other to find the smallest exterior angle.
  //as can be seen here:
  //"https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Jarvis_march
  //_convex_hull_algorithm_diagram.svg/280px-Jarvis_march_convex_hull_algorithm_diagram.svg.png"
  var previousPoint = new Point(pointArray[leftIndex].x, canvas.height);
  var startPoint = pointArray[leftIndex];
  var currentPoint = pointArray[leftIndex];
  var currentPointIndex = leftIndex;
  var previousPointIndex = -1;
  //prepare a variable that constantly changes.
  var exteriorAngle, firstSide, secondSide, thirdSide;
  var convexHullArray = [];
  convexHullArray.push(startPoint);
  context.beginPath();
  context.strokeStyle = '#DDDDDD';
  context.lineWidth = 1;

  while((convexHullArray.length===1 || convexHullArray[0]!==convexHullArray[convexHullArray.length-1])){
    var maxIntAngle = 0;
    var currentIntAngle;
    var temp = currentPointIndex;

    for(var i=0; i<pointArray.length; i++){
      if(i===currentPointIndex || i===previousPointIndex)
        continue;
      else{
        //now we do math to find the maximum interior* angle, law of cosines is our friend here
        //its the same thing, minimum exterior angle, maxmimum interior angle, xdddd
        firstSide = measureDistance(previousPoint, currentPoint);
        secondSide = measureDistance(currentPoint, pointArray[i]);
        thirdSide = measureDistance(previousPoint, pointArray[i]);
        currentIntAngle = Math.acos(((Math.pow(thirdSide,2)) - Math.pow(secondSide,2) - Math.pow(firstSide,2))/(-2*secondSide*firstSide));
        if(currentIntAngle>maxIntAngle){
          currentPointIndex = i;
          maxIntAngle = currentIntAngle;
        }
        //window.setInterval(drawLine(currentPoint, pointArray[i]), 1000);
      }
    }
    previousPointIndex = temp;
    //push the point onto convexhullarray
    convexHullArray.push(pointArray[currentPointIndex]);
    //also update current point.
    previousPoint.x = currentPoint.x;
    previousPoint.y = currentPoint.y;
    currentPoint = pointArray[currentPointIndex];
  }

  //now we have an array that holds the points of the convex hull.
  context.beginPath();
  context.moveTo(convexHullArray[0].x, convexHullArray[0].y);
  context.strokeStyle = '#000000';
  context.lineWidth = 1;
  for(var i=1; i<convexHullArray.length; i++){
    context.lineTo(convexHullArray[i].x, convexHullArray[i].y);
    context.stroke();
  }

  return;
}

function GrahamObject(point, angle){
  this.x = point.x;
  this.y = point.y;
  this.angle = angle;
}

function isCCW(a, b, c){
  var x = b.x*c.y - b.y*c.x - a.x*c.y + c.x*a.y + a.x*b.y - b.x*a.y;
  if(x<=0)
    return false;
  return true;
}

function computeGS(pointArray){
  if(pointArray.length<=2)
    return pointArray;
  //get bottomost point.
  var bottomPoint = pointArray[0];
  bottomPointIndex = 0;
  for(var i=0; i<pointArray.length; i++){
    if(pointArray[i].y>bottomPoint.y){
      bottomPoint = pointArray[i];
      bottomPointIndex = i;
    }
  }

  var grahamScanArray = [];
  var interiorAngleFinder = new Point(canvas.width, bottomPoint.y);
  grahamScanArray.push(new GrahamObject(bottomPoint, 0));
  for(var i=0; i<pointArray.length; i++){
    if(i===bottomPointIndex)
      continue;
    var toPush = new GrahamObject(pointArray[i], 0);
    //update the angle using math.
    var firstSide = measureDistance(interiorAngleFinder, bottomPoint);
    var secondSide = measureDistance(bottomPoint, pointArray[i]);
    var thirdSide = measureDistance(interiorAngleFinder, pointArray[i]);
    toPush.angle = Math.acos(((Math.pow(thirdSide,2)) - Math.pow(secondSide,2) - Math.pow(firstSide,2))/(-2*secondSide*firstSide));
    grahamScanArray.push(toPush);
  }
  grahamScanArray.sort(function(a,b){
    if(a.angle<=b.angle)
      return -1;
    return 1;
  });

  //to make a cycle of points, for the algorithm later to work properly.
  grahamScanArray.push(grahamScanArray[0]);

  //now we do math to determine what goes in the convexhull or not.
  //we can try something cool with matrices.
  //the first two values are definitely in the convex hull.
  var convexHullArray = [];
  convexHullArray.push(grahamScanArray[0]);
  convexHullArray.push(grahamScanArray[1]);
  for(var i=2; i<grahamScanArray.length; i++){
    var currentPoint = convexHullArray.pop();
    while(isCCW(convexHullArray[convexHullArray.length-1], currentPoint, grahamScanArray[i])){
      currentPoint = convexHullArray.pop();
    }
    convexHullArray.push(currentPoint);
    convexHullArray.push(grahamScanArray[i]);
  }

  //now draw lines.
  context.beginPath();
  context.moveTo(convexHullArray[0].x, convexHullArray[0].y);
  context.strokeStyle = '#12397C';
  context.lineWidth = 1;
  for(var i=1; i<convexHullArray.length; i++){
    context.lineTo(convexHullArray[i].x, convexHullArray[i].y);
    context.stroke();
  }

  convexHullArray.pop();

  return convexHullArray;
}

function drawLine(a,b){
  context.moveTo(a.x, a.y);
  context.lineTo(b.x, b.y);
  context.stroke();
}

function computeCA(pointArray){
  //we need to partition the points such that we can perform graham scan on each, and then
  //perform jarvis march on the convex hull points from the graham scan.

  //algorithm to find the size of the convex hull
  //there arent enough tools online (the ones that exist i dont understand)
  //so we assume m, the size of the convex hull, is 3.
  var subHullArray = [];
  var subHull;
  subHull = computeGS(pointArray.splice(0, Math.ceil(pointArray.length/3)));
  for(var i=0; i<subHull.length; i++){
    subHullArray.push(subHull[i]);
  }
  subHull = computeGS(pointArray.splice(0, Math.ceil(pointArray.length/3)));
  for(var i=0; i<subHull.length; i++){
    subHullArray.push(subHull[i]);
  }
  subHull = computeGS(pointArray);
  for(var i=0; i<subHull.length; i++){
    subHullArray.push(subHull[i]);
  }
  computeJM(subHullArray);

  return;
}
