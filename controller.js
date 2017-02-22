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
    var handleSlider = document.querySelector('#volume .slider-vertical');
    handleSlider.setAttribute('max', HANDLE_BOTTOM);
    handleSlider.style.width = HANDLE_BOTTOM / 648.7 * BALL_CONTAINER_IMAGE_HEIGHT + "px";
    var volumeOutput = document.querySelector('#volume .output-single');
    var handleHeld = false; // Flag for mouse events
    handle.mousedown(function () {
        handleHeld = true;
    })
    handleSlider.oninput = function () {
        this.update();
    }
    handleSlider.update = function () {
        var newValue = handleSlider.value;
        handle.transform({
            y: newValue
        });
        ballBoundary.top = newValue;
        volumeOutput.textContent = Math.round((100 - newValue / handleSlider.max * 100) *
            100) / 100;
    };
    document.getElementsByTagName('html').item(0).onmousemove = function (e) {

        // If the user is currently 'holding the handle'
        if (handleHeld) {
            handleSlider.stepUp(e.movementY * 648.7 / BALL_CONTAINER_IMAGE_HEIGHT);
            handleSlider.update();
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
    //demo.air();

}());
