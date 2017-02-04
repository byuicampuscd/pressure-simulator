/* eslint-env browser */
/* eslint no-unused-vars:0 */
/* global SVG */

var air = (function () {
    /* START Desired Conditions - These can be modified */

    var BALL_COUNT = 50;
    var ballImageSize = 5;
    var ballContainerImageWidth = 400; // The ratio is maintained below
    var speedMultiplier = 5;

    /* END of Desired Conditions */


    /* START Misc Setup */

    // Calculated sizes from the indicated width above
    var ballContainerImageRatio = 648.7 / 379.2; // ViewBox Height/Width
    var ballContainerImageHeight = ballContainerImageWidth * ballContainerImageRatio;

    // Container element for the svg tag
    var drawingElement = document.getElementById('pressureDrawing');
    drawingElement.style.width = ballContainerImageWidth + "px";
    drawingElement.style.height = ballContainerImageHeight + "px";


    // Store the outmost svg in SVG.js form
    var draw = SVG('pressureDrawing').svg(document.getElementById("svg_ball_container").outerHTML);

    /* END Misc Setup */


    /* START Handling of handle movements using SVG.js */

    var handle = draw.select('#handle').first();
    /*handle.draggable(function(x, y) {
        return {y: y >= 0 && y < boundary.bottom - 20}
    });*/
    var handleHeld = false; // Flag for mouse events
    handle.mousedown(function () {
        handleHeld = true;
    })
    document.getElementsByTagName('html').item(0).onmousemove = function (e) {

        // If the user is currently 'holding the handle'
        if (handleHeld) {

            // Calculate the movement within the viewBox
            var distance = e.movementY * 648.7 / ballContainerImageHeight;

            // If we're trynig to move the handle within the boundary
            var handlePosition = handle.transform('y');
            if ((distance < 0 && handlePosition > 0) || (distance > 0 && handlePosition < boundary.bottom - 25)) {

                // Move the handle
                handle.transform({
                    y: distance,
                    relative: true
                });

                // Align the top of the ball boundary
                boundary.top += distance;
            }
        }
    }
    document.getElementsByTagName('html').item(0).onmouseup = function () {
        handleHeld = false;
    }

    /* END Handling of handle movements using SVG.js */


    /* START boundary object */

    // Boundary limitations of the balls, relative to the container element
    var boundary = {
        top: 0, // This is the only one that changes, done in handle moving code
        right: Number(document.getElementById('ballBoundary').getAttribute('width')),
        bottom: Number(document.getElementById('ballBoundary').getAttribute('height')),
        left: 0
    }

    /* END boundary object */


    /* START Ball Prototype */

    /* Constructor Properties */
    function Ball(startingLocation, speed, direction) {

        // Holds the center coordinates
        this.location = {
            x: startingLocation.x,
            y: startingLocation.y
        };

        // Velocity vector
        this.velocity = {
            x: speed * Math.cos(direction),
            y: speed * Math.sin(direction)
        }

        // Create the ball copy in svg using SVG.js
        this.circle = draw.select('#svg_ball_boundary').first().nested().svg(document.getElementById("svg_ball").outerHTML).size(ballImageSize, ballImageSize);

    }
    /* Constructor Methods */
    // Use the ball's velocity and collision handling to update its location
    Ball.prototype.updateLocation = function () {

            // Update the ball's location info
            this.location.x += this.velocity.x;
            this.location.y += this.velocity.y;

            // Check for and handle collisions
            this.handleCollisions();

            // Move the ball to new location
            this.circle.cx(this.location.x).cy(this.location.y);

        }
        // Check for collisions and modify location and velocity vector accordingly
    Ball.prototype.handleCollisions = function () {

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

    /* END Ball Prototype */


    /* START Other ball code */

    // Will generate n balls according to requirements
    function generateBalls(n) {

        var tempArray = new Array(n).fill(null),
            // Create a speed variable holding random speed
            initialSpeed = Math.random() * speedMultiplier;

        // Use a loop to creae n Balls, with random location and direction, but same speed
        return tempArray.map(function (ele, i) {
            var initialLocation = {
                    x: ballContainerImageWidth * Math.random(),
                    y: ballContainerImageHeight * Math.random()
                },
                initialDirection = 2 * Math.PI * Math.random();

            return new Ball(initialLocation, initialSpeed, initialDirection);
        })


    }

    // Update the boundary and move the balls one frame
    function moveBalls(ballArray) {
        ballArray.forEach(function (ball) {
            ball.updateLocation();
        });
    }

    /* END Other ball code */

    var pressureTimer, balls;

    function makeBalls() {
        balls = generateBalls(BALL_COUNT);
        pressureTimer = setInterval(function () {
            moveBalls(balls);
        }, 1000 / 30);
    }

    // Store a generated set of balls
    /* START Getting the simulation going */
    /* END Getting the simulation going */

    function endAnimation() {
        clearInterval(pressureTimer);
    }

    return {
        makeBalls: makeBalls,
        endAnimation: endAnimation
    }

}());

air.makeBalls();
setTimeout(air.endAnimation, 3000);
