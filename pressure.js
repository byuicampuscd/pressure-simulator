/* Desired Sizes */

var ballImageSize = 5;
var ballContainerImageWidth = 200; // The ratio is maintained below

/* End of Desired Sizes */

var ballContainerImageRatio = 648.7/379.2; // Height/Width

// Container element for the svg tag
var drawingElement = document.getElementById('pressureDrawing');
drawingElement.style.width = ballContainerImageWidth + "px";
drawingElement.style.height = (ballContainerImageWidth * ballContainerImageRatio) + "px";

var areaWidth = drawingElement.style.width.slice(0, -2);
var areaHeight = drawingElement.style.height.slice(0, -2);


var draw = SVG('pressureDrawing').svg(document.getElementById("svg_ball_container").outerHTML); //size(areaWidth, areaHeight);

// Handling of handle movements using SVG.js
var handle = draw.select('#handle').first();
var handleHeld = false;
handle.mousedown(function(e) {
    handleHeld = true;
})
draw.mousemove(function(e) {
    if (handleHeld) {
        var distance = e.movementY;
        var handlePosition = handle.transform('y');
        if ((distance < 0 && handlePosition > 0) || (distance > 0 && handlePosition < boundary.bottom - 25)) {
            handle.transform({ y: distance, relative: true});
            boundary.top += distance;
        }
    }
})
draw.mouseup(function(e) {
    handleHeld = false;
})



// Boundary limitations of the balls, relative to the container element
var boundary = {
    top: 0
}
function updateBoundary() {
    var testboundary = document.getElementById('ballBoundary');
    var handledisc = document.getElementById('handle');//.getElementsByTagName('ellipse').item(0);
    boundary.left = 0;
    boundary.right = Number(testboundary.getAttribute('width'));
    boundary.bottom = Number(testboundary.getAttribute('height'));
}


function Ball(startingLocation, speed, direction) {
    this.location = {
        x: startingLocation.x,
        y: startingLocation.y
    };
    this.velocity = {
        x: speed * Math.cos(direction),
        y: speed * Math.sin(direction)
    }
    
    this.circle = draw.select('#svg_ball_boundary').first().nested().svg(document.getElementById("svg_ball").outerHTML).size(ballImageSize, ballImageSize);
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


var balls = generateBalls(50);
function moveBalls() {
    console.log(document.getElementById('handle').getElementsByTagName('ellipse').item(0).getAttribute('cy'));
    updateBoundary();
    balls.forEach(function(ball) {
        ball.updateLocation();
    });
}

var pressureTimer = setInterval(moveBalls, 1000/30);
