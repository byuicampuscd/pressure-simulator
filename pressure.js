/* Image links and Sizes */

var ballImage = "ball.svg";
var ballImageSize = 5;
var ballContainerImage = "ball_container.svg";
var ballContainerRimImage = "images/outertube.png";
var ballContainerImageWidth = 379.2;
var ballContainerImageHeight = 648.7;
var lidImage = "images/disc.png";
var lidImageWidth = 453;
var lidImageHeight = 123;

/* End of Image links and Sizes */

// Container element for the svg tag
var drawingElement = document.getElementById('pressureDrawing');
drawingElement.style.width = ballContainerImageWidth + "px";
drawingElement.style.height = ballContainerImageHeight + "px";


var areaWidth = drawingElement.style.width.slice(0, -2);
var areaHeight = drawingElement.style.height.slice(0, -2);

var draw = SVG('pressureDrawing').svg(document.getElementById("svg_ball_container").outerHTML); //size(areaWidth, areaHeight);

// Boundary limitations of the balls, relative to the container element
var boundary = {
    left: draw.select('g#back path').first().x(),
    top: 100,
    right: Number(drawingElement.style.width.slice(0, -2)) - 27,
    bottom: Number(drawingElement.style.height.slice(0, -2)) - 75
}
/*var boundary = {
    left: Number(drawingElement.style.left.slice(0, -2)),
    top: Number(drawingElement.style.top.slice(0, -2)),
    right: Number(drawingElement.style.left.slice(0, -2)) + Number(drawingElement.style.width.slice(0, -2)),
    bottom: Number(drawingElement.style.top.slice(0, -2)) + Number(drawingElement.style.height.slice(0, -2))
}*/



function Ball(startingLocation, speed, direction) {
    this.location = {
        x: startingLocation.x,
        y: startingLocation.y
    };
    this.velocity = {
        x: speed * Math.cos(direction),
        y: speed * Math.sin(direction)
    }
    
    this.circle = draw.nested().svg(document.getElementById("svg_ball").outerHTML).size(ballImageSize, ballImageSize);
    //this.circle = draw.image(ballImage, ballImageSize, ballImageSize).cx(startingLocation.x).cy(startingLocation.y);
    //this.circle = draw.circle(10).cx(startingLocation.x).cy(startingLocation.y).attr({fill: 'black'});
}
Ball.prototype.updateLocation = function() {
    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;
    //this.circle.dmove(this.velocity.x, this.velocity.y);
    
    this.handleCollisions();
    this.circle.cx(this.location.x).cy(this.location.y);
}
Ball.prototype.handleCollisions = function() {
    
    var testboundary = document.getElementById('ballBoundary')
    var boundaryLeft = testboundary.getAttribute('x');
    var boundaryTop = testboundary.getAttribute('y');
    var boundaryRight = boundaryLeft + testboundary.getAttribute('width');
    var boundaryBottom = boundaryTop + testboundary.getAttribute('height');
    
    // If the ball has crossed a boundary, reflect it back over the boundary, and change its direction
    if (this.location.x < boundaryLeft) {
        this.velocity.x = -this.velocity.x;
        this.location.x += 2 * (boundaryLeft - this.location.x);
    }
    if (this.location.y < boundaryTop) {
        this.velocity.y = -this.velocity.y;
        this.location.y += 2 * (boundaryTop - this.location.y);
    }
    if (this.location.x > boundaryRight) {
        this.velocity.x = -this.velocity.x;
        this.location.x += 2 * (boundaryRight - this.location.x);
    }
    if (this.location.y > boundaryBottom) {
        this.velocity.y = -this.velocity.y;
        this.location.y += 2 * (boundaryBottom - this.location.y);
    }
}
function generateBalls(n) {
    
    // Create a speed variable holding random speed
    var speedMultiplier = 5;
    var initialSpeed = Math.random() * speedMultiplier;
    
    
    // Use a loop to creae n Balls, with random location and direction, but same speed
    var ballArray = [];
    var newBall;
    var initialLocation = {};
    var initialDirection;
    var i;
    for (i = 0; i < n; i++) {
        initialLocation.x = areaWidth * Math.random();
        initialLocation.y = areaHeight * Math.random();
        initialDirection = 2 * Math.PI * Math.random();
        
        newBall = new Ball(initialLocation, initialSpeed, initialDirection);
        ballArray.push(newBall);
    }
    
    return ballArray;
}

//draw.image(ballContainerImage, ballContainerImageWidth, ballContainerImageHeight);
//alert(document.getElementById("back"));
//var containerBack = draw.nested().svg(document.getElementById("back").outerHTML);
var balls = generateBalls(50);
function moveBalls() {
    balls.forEach(function(ball) {
        ball.updateLocation();
    });
}
//draw.image(lidImage, lidImageWidth, lidImageHeight).x(boundary.left - 2).y(boundary.top - (lidImageHeight/2));
//var containerHandle = draw.nested().svg(document.getElementById("handle").outerHTML);
//draw.image(ballContainerRimImage, ballContainerImageWidth, ballContainerImageHeight);
//var containerFront = draw.nested().svg(document.getElementById("front").outerHTML);
var pressureTimer = setInterval(moveBalls, 1000/30);
