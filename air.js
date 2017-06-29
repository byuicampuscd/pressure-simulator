/* eslint-env browser */
/* eslint no-unused-vars:0 */
/* global SVG */

/**
 * This module takes care of the air simulation, where the air is represented by balls.
 * You can start the animation by calling {@link module:air~startAnimation air.startAnimation()}.
 * If settings other the defaults are desired, call {@link module:air~setup air.setup()} first.
 *
 * @module air
 *
 * @requires external:SVGjs
 */
var air = (function () {

    var pressureTimer, balls;

    /* START Desired Conditions - These can be modified */

    const BALL_COUNT_DEFAULT = 25;
    const BALL_SPEED_DEFAULT = 10;
    const BALL_SIZE_DEFAULT = 20;

    /* END of Desired Conditions */

    /**
     * This sets up the balls for animation, but doesn't start it. See 
     * {@link module:air~startAnimation startAnimation()} for how to start it.
     * 
     * @method setup
     *
     * @arg {Object} [settings] - The settings for the balls
     * @arg {number} [settings.ballCount = 25] - The number of balls to generate
     * @arg {number} [settings.ballInitialSpeed = 10] - The initial speed of the balls (in pixels
     *                                           per 30th of a second within its viewport)
     * @arg {number} [settings.ballSize = 20] - The side length of the square box each ball
     *                                   fits inside of (in pixels within its viewport)
     */
    function setup(settings) {

        if (settings === undefined) {
            settings = {};
        }
        if (settings.ballCount === undefined) {
            settings.ballCount = BALL_COUNT_DEFAULT;
        }
        if (settings.ballInitialSpeed === undefined) {
            settings.ballInitialSpeed = BALL_SPEED_DEFAULT;
        }
        if (settings.ballSize === undefined) {
            settings.ballSize = BALL_SIZE_DEFAULT;
        }
        balls = generateBalls(settings.ballCount, settings.ballInitialSpeed, settings.ballSize);
    }

    /* START boundary object */

    // Boundary limitations of the balls, relative to the container element
    const boundary = {
        top: 0,
        right: Number(document.querySelector('#svg_ball_boundary').getAttribute('width')),
        bottom: Number(document.querySelector('#svg_ball_boundary').getAttribute('height')),
        left: 0 // This is the only one that changes, done in handle moving code
    };

    /**
     * Get the boundary object that contains the balls. It has a top, right, bottom, and left.
     * Only the left property can be changed.
     *
     * @method getBoundary
     */
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
    function Ball(startingLocation, speed, direction, size) {

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
            .nested().svg(document.getElementById("svg_ball_wrapper_div").innerHTML)
            .size(size, size);

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
    function generateBalls(n, initialSpeed, ballSize) {

        var i, initialLocation, initialDirection, tempArray = [];

        // Use a loop to creae n Balls, with random location and direction, but same speed
        for (i = 0; i < n; i++) {
            initialLocation = {
                x: boundary.right * Math.random(),
                y: boundary.bottom * Math.random()
            };
            initialDirection = 2 * Math.PI * Math.random();

            tempArray[i] = new Ball(initialLocation, initialSpeed, initialDirection, ballSize);
        }

        return tempArray;
    }

    // Update the boundary and move the balls one frame
    function moveBalls(ballArray) {
        ballArray.forEach(function (ball) {
            ball.updateLocation();
        });
    }

    /**
     * Sets the speed of all the balls
     *
     * @method setBallSpeed
     *
     * @arg {number} newSpeed - The new speed in pixels per 30th of a second (within their viewport)
     */
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

    /**
     * Start the repeating interval to move the balls every 30th of a second.
     * If no balls exist yet, it will create 50 first based off the defaults 
     * (see {@link module:air~setup setup()}).
     *
     * @method startAnimation
     */
    function startAnimation() {
        if (balls === undefined) {
            generateBalls(BALL_COUNT_DEFAULT, BALL_SPEED_DEFAULT, BALL_SIZE_DEFAULT);
        }
        pressureTimer = setInterval(function () {
            moveBalls(balls);
        }, 1000 / 30);
    }

    /**
     * Stop the repeating interval so the balls stop moving
     *
     * @method endAnimation
     */
    function endAnimation() {
        clearInterval(pressureTimer);
    }

    /*
     * Methods to access globally
     * @alias air
     * @namespace
     */
    return {
        /* @method */
        setup: setup,

        //generateBalls: generateBalls,
        setBallSpeed: setBallSpeed,
        startAnimation: startAnimation,
        endAnimation: endAnimation,

        getBoundary: getBoundary
    }

}());
