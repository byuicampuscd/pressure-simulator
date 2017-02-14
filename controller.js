var controller = (function () {

    /* START Initial setup */

    air.setup(50, 3);
    //air.generateBalls(50, 3);
    air.startAnimation();

    /* END Initial setup */


    /* START Handling of handle movements using SVG.js and volume control */

    var ballBoundary = air.getBoundary();
    // Also set the bottom boundary for the handle
    const HANDLE_BOTTOM = ballBoundary.bottom - 20;

    const MAX_VOLUME = 100; // in mL

    var handle = draw.select('#handle').first();
    var volumeOutput = document.getElementById("volume")
        .getElementsByClassName("output-single").item(0);
    var handleHeld = false; // Flag for mouse events
    handle.mousedown(function () {
        handleHeld = true;
    })
    document.getElementsByTagName('html').item(0).onmousemove = function (e) {

        // If the user is currently 'holding the handle'
        if (handleHeld) {

            // Calculate the movement within the viewBox
            var distance = e.movementY * 648.7 / BALL_CONTAINER_IMAGE_HEIGHT,
                volumeChange = -distance * MAX_VOLUME / HANDLE_BOTTOM;

            // If we're trynig to move the handle within the boundary
            var handlePosition = handle.transform('y');
            if ((distance < 0 && handlePosition > 0) || (distance > 0 && handlePosition < HANDLE_BOTTOM)) {

                // Move the handle
                handle.transform({
                    y: distance,
                    relative: true
                });

                // Align the top of the ball boundary
                ballBoundary.top += distance;
                //boundary.setTop(boundary.top + distance);

                // Change the volume indicator
                volumeOutput.textContent = round(Number(volumeOutput.textContent) + volumeChange,
                    2);
            }
        }
    }
    document.getElementsByTagName('html').item(0).onmouseup = function () {
        handleHeld = false;
    }

    /* END Handling of handle movements using SVG.js */

    /* Demos */

    var demo = {

        // Air movement demo
        air: function () {
            setTimeout(air.endAnimation, 3000);
            setTimeout(air.startAnimation, 4000);
            setTimeout(function () {
                air.setBallSpeed(10)
            }, 6000);
            setTimeout(function () {
                air.setBallSpeed(3)
            }, 8000);
        }
    }

    // Run demos
    demo.air();

}());
