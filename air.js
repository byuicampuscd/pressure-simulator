/* eslint-env browser */
/* eslint no-unused-vars:0 */
/* global SVG */

/**
 * This module takes care of the air simulation, with the container, balls, and handle.
 *
 * Global methods available in air object:
 *
 * generateBalls(count, speed) - Creates the balls representing the air
 * setBallSpeed(newSpeed) - Sets the balls' speed to newSpeed px/s (within svg viewBox)
 * startAnimation() - Makes the balls move; if none exist, it creates 50 first
 * endAnimation() - Makes the balls stop
 */
var air = (function () {

    var pressureTimer, balls;

    /* START Desired Conditions - These can be modified */

    const BALL_COUNT_DEFAULT = 50;
    const BALL_SPEED_DEFAULT = 10;
    const BALL_IMAGE_SIZE = 15;

    /* END of Desired Conditions */

    function setup(ballCount, ballInitialSpeed) {

        if (ballCount === undefined) {
            ballCount = BALL_COUNT_DEFAULT;
        }
        if (ballInitialSpeed === undefined) {
            ballInitialSpeed = BALL_SPEED_DEFAULT;
        }
        balls = generateBalls(ballCount, ballInitialSpeed);
    }

    /* START boundary object */

    // Boundary limitations of the balls, relative to the container element
    const boundary = {
        top: 0,
        right: Number(document.querySelector('#svg_ball_boundary').getAttribute('width')),
        bottom: Number(document.querySelector('#svg_ball_boundary').getAttribute('height')),
        left: 0 // This is the only one that changes, done in handle moving code
    };

    // Seemed to figure this part out
    function getBoundary() {

        return Object.defineProperties({}, {
            'top': {
                get: function () {
                    return boundary.top
                }
            },
            'right': {
                get: function () {
                    return boundary.right
                }
            },
            'bottom': {
                get: function () {
                    return boundary.bottom
                }
            },
            'left': {
                get: function () {
                    return boundary.left
                },
                set: function (newLeft) {
                    boundary.left = newLeft
                }
            }
        });
    }

    /* END boundary object */


    /* START Ball Prototype */

    /* Constructor - Properties */
    function Ball(startingLocation, speed, direction) {

        // Holds the center coordinates
        // No error check since the Ball constructor is contained in a closure
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
        this.circle = syringeSVGjs.select('#svg_ball_boundary').first()
            .nested().svg(document.getElementById("svg_ball").outerHTML)
            .size(BALL_IMAGE_SIZE, BALL_IMAGE_SIZE);

        // Displays it
        this.updateLocation();
    }

    /* Constructor - Methods */

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

        // If the ball has crossed a boundary, reflect it back over the boundary, 
        // and change its direction
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

    // Will generate n balls with same initialSpeed according to requirements
    function generateBalls(n, initialSpeed) {

        var tempArray = new Array(n).fill(null);

        // Use a loop to creae n Balls, with random location and direction, but same speed
        return tempArray.map(function (ele, i) {
            var initialLocation = {
                    x: boundary.right * Math.random(),
                    y: boundary.bottom * Math.random()
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

    // Change the speed of all the balls
    function setBallSpeed(newSpeed) {

        // Find the magnitude (speed) of the velocity vector from one ball
        var v = balls[0].velocity;
        var oldSpeed = Math.sqrt(v.x * v.x + v.y * v.y);

        // Modify the speed by multiplying the vector of all balls by the change ratio
        balls.forEach(function (ball) {
            ball.velocity.x *= newSpeed / oldSpeed;
            ball.velocity.y *= newSpeed / oldSpeed;
        });
    }

    /* END Other ball code */

    // Start the repeating interval to moveBalls every 30th of a second
    function startAnimation() {
        if (balls === undefined) {
            generateBalls(BALL_COUNT_DEFAULT, BALL_SPEED_DEFAULT);
        }
        pressureTimer = setInterval(function () {
            moveBalls(balls);
        }, 1000 / 30);
    }

    // Stop the repeating interval so the balls stop moving
    function endAnimation() {
        clearInterval(pressureTimer);
    }

    // Methods to access globally
    return {
        setup: setup,

        //generateBalls: generateBalls,
        setBallSpeed: setBallSpeed,
        startAnimation: startAnimation,
        endAnimation: endAnimation,

        getBoundary: getBoundary
    }

}());
