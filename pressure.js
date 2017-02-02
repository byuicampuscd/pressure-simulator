/* Image links and Sizes */

var ballImage = "images/atom.png";
var ballImageSize = 10;
var ballContainerImage = "images/innertube.png";
var ballContainerRimImage = "images/outertube.png";
var ballContainerImageWidth = 500;
var ballContainerImageHeight = 600;
var lidImage = "images/disc.png";
var lidImageWidth = 453;
var lidImageHeight = 123;

/* End of Image links and Sizes */

// Container element for the svg tag
var drawingElement = document.getElementById('pressureDrawing');
drawingElement.style.width = ballContainerImageWidth + "px";
drawingElement.style.height = ballContainerImageHeight + "px";

// Boundary limitations of the balls, relative to the container element
var boundary = {
    left: 25,
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



var areaWidth = drawingElement.style.width.slice(0, -2);
var areaHeight = drawingElement.style.height.slice(0, -2);

var draw = SVG('pressureDrawing').size(areaWidth, areaHeight);

function Ball(startingLocation, speed, direction) {
    this.location = {
        x: startingLocation.x,
        y: startingLocation.y
    };
    this.velocity = {
        x: speed * Math.cos(direction),
        y: speed * Math.sin(direction)
    }
    
    this.circle = draw.image(ballImage, ballImageSize, ballImageSize).cx(startingLocation.x).cy(startingLocation.y);
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
    
    // If the ball has crossed a boundary, reflect it back over the boundary, and change its direction
    if (this.location.x < boundary.left) {
        this.velocity.x = -this.velocity.x;
        this.location.x += 2 * (boundary.left - this.location.x);
    }
    if (this.location.y < boundary.top) {
        this.velocity.y = -this.velocity.y;
        this.location.y += 2 * (boundary.top - this.location.y);
    }
    if (this.location.x > boundary.right) {
        this.velocity.x = -this.velocity.x;
        this.location.x += 2 * (boundary.right - this.location.x);
    }
    if (this.location.y > boundary.bottom) {
        this.velocity.y = -this.velocity.y;
        this.location.y += 2 * (boundary.bottom - this.location.y);
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

draw.image(ballContainerImage, ballContainerImageWidth, ballContainerImageHeight);
var balls = generateBalls(50);
function moveBalls() {
    balls.forEach(function(ball) {
        ball.updateLocation();
    });
}
draw.image(lidImage, lidImageWidth, lidImageHeight).x(boundary.left - 2).y(boundary.top - (lidImageHeight/2));
draw.image(ballContainerRimImage, ballContainerImageWidth, ballContainerImageHeight);
var pressureTimer = setInterval(moveBalls, 1000/30);
