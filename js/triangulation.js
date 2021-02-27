let canvas;
let context;

let points = [];
let prevPoint = null;

let Point = class Point {
    constructor(x, y, prev) {
        this.x = x;
        this.y = y;

        // Have this to easily see which vertex is adjacent.
        this.prev = prev

        // Fill this out later when completing the polygon.
        this.next = null
    }
}

function init() {
    // Initialize the canvas and make it pretty.
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
        // Add "-6" to the coordinate values because the canvas width and heights
        // are extended by 6.
        const x = e.pageX - canvas.offsetLeft - 6;
        const y = e.pageY - canvas.offsetTop - 6;

        let p = new Point(x, y, prevPoint);
        points.push(p);

        // Create circles when clicking in the canvas to specify vertices.
        context.beginPath();
        context.arc(x, y, 4, 0, 2 * Math.PI, false);
        context.fillStyle = '#000000'
        context.fill();
    });
}

// Update the prev and next values and draw lines.
function connectPoints() {
    if (points.length < 3) {
        return;
    }

    // Fix up the prev/point values in each point.
    points[0].prev = points[points.length-1];

    len = points.length;

    for (i = 0; i < points.length; i++) {
        points[i].next = points[i+1 % len];
        points[i].prev = points[i-1 % len];
    }

    points[0].prev = points[len - 1];
    points[len-1].next =  points[0];

    // Initialize the line drawing to create edges
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.strokeStyle = '#000000';
    context.lineWidth = 1;
    for(let i=1; i<points.length; i++){
        context.lineTo(points[i].x, points[i].y);
        context.stroke();
    }
    context.lineTo(points[0].x, points[0].y);
    context.stroke();
}

// Verify that the shape is a polygon (no intersecting lines).
function validatePolygon() {
}

function splitIntoMonotonePolygons() {
}

function verifyMonotony() {
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Given a point and an array of vertices, draw lines from initial
// to all the vertices in the array
function connect(initial, vertices) {
    for (let i=0; i<vertices.length; i++) {
        context.moveTo(initial.x, initial.y);
        context.lineTo(vertices[i].x, vertices[i].y);
        context.stroke();
    }
}

function isAbove180Degrees(p1, p2, p3, chain) {
    xDist1 = p2.x - p1.x;
    xDist2 = p3.x - p2.x;
    yDist1 = p2.y - p1.y;
    yDist2 = p3.y - p2.y;

    let x =  Math.atan2(xDist1 * yDist2 - yDist1 * xDist2, xDist1 * xDist2 + yDist1 * yDist2);
    return chain.has(serializePoint(p2)) ? x > 0 : x < 0;
}

function isNextTo(p1, p2) {
    if (p1.prev.x == p2.x && p1.prev.y == p2.y) return true;
    if (p1.next.x == p2.x && p1.next.y == p2.y) return true;
    return false;
}

function areEqualPoints(p1, p2) {
    return p1.x == p2.x && p1.y == p2.y;
}

function serializePoint(point) {
    return String(point.x) + " " + String(point.y);
}

function createUpperAndLowerChains(copy) {
    // Define upper and lower chains to be able to determine if
    // interior angles are > 180 degrees or not.
    const upperChain = new Set()
    const lowerChain = new Set()

    if (copy[0].y > copy[1].y) {
        curr = copy[1];
        while (!areEqualPoints(curr, copy[copy.length - 1])) {
            upperChain.add(serializePoint(curr.prev));
            upperChain.add(serializePoint(curr));
            upperChain.add(serializePoint(curr.next));
            if (areEqualPoints(copy[0].next, copy[1])) {
                curr = curr.next;
            }
            else {
                curr = curr.prev;
            }
        }
        for (let i=0; i<copy.length; i++) {
            if (!upperChain.has(serializePoint(copy[i]))) {
                lowerChain.add(serializePoint(copy[i]));
            }
        }
        lowerChain.add(serializePoint(copy[0]));
        lowerChain.add(serializePoint(copy[copy.length - 1]));
    }
    else {
        curr = copy[1];
        while (!areEqualPoints(curr, copy[copy.length - 1])) {
            lowerChain.add(serializePoint(curr.prev));
            lowerChain.add(serializePoint(curr));
            lowerChain.add(serializePoint(curr.next));
            if (areEqualPoints(copy[0].next, copy[1])) {
                curr = curr.next;
            }
            else {
                curr = curr.prev;
            }
        }
        for (let i=0; i<copy.length; i++) {
            if (!lowerChain.has(serializePoint(copy[i]))) {
                upperChain.add(serializePoint(copy[i]));
            }
        }
        upperChain.add(serializePoint(copy[0]));
        upperChain.add(serializePoint(copy[copy.length - 1]));
    }
    return upperChain;
}


// Implement algorithm seen in slides.
async function triangulate() {
    // TODO: If the shape is assumed to be x-monotone, we need to sort by x-coordinates first.
    let copy = points.slice();
    copy.sort(function(a, b) {
        return a.x - b.x;
    });

    const upperChain = createUpperAndLowerChains(copy);
    connect(copy[1], [copy[2]]);

    reflexChain = [copy[1], copy[2]];

    for (let i=3; i<copy.length; i++) {
        if (!isNextTo(copy[i], reflexChain[reflexChain.length - 1])) {
            connect(copy[i], reflexChain);
            last = reflexChain[reflexChain.length - 1];
            reflexChain = [last, copy[i]];
        }
        else {
            while(reflexChain.length >= 2 &&
                   !isAbove180Degrees(copy[i],
                   reflexChain[reflexChain.length - 1],
                   reflexChain[reflexChain.length - 2],
                   upperChain)) {
                connect(copy[i], [reflexChain[reflexChain.length - 1], reflexChain[reflexChain.length - 2]]);
                reflexChain.pop();
            }
            reflexChain.push(copy[i]);
        }
        await sleep(1000);
    }
}

function createTriangulation() {
    connectPoints();

    validatePolygon();

    splitIntoMonotonePolygons();

    verifyMonotony();

    // TODO: I currently assume that I'm working with x-monotone polygons. Triangulate them.
    triangulate();
}

$(document).ready(init());
