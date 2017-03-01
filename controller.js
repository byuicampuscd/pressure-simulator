/**
 * Requires:
 * - air.js - provides object called air, which provides functionality for the air balls in svg
 */
var controller = (function () {

    /* START Initial setup */

    air.setup(50, 3);
    //air.generateBalls(50, 3);
    air.startAnimation();

    /* END Initial setup */


    /* START Handling of Volume section */

    var ballBoundary = air.getBoundary();
    // Also set the bottom boundary for the handle
    const HANDLE_BOTTOM = ballBoundary.bottom - 20;

    // Handle
    var handle = ballContainerSVGjs.select('#handle').first();
    var handleHeld = false; // Flag for mouse events
    handle.mousedown(function () {
        handleHeld = true;
    })

    // Handle Slider
    var handleSlider = document.querySelector('#volume .slider-vertical');
    handleSlider.setAttribute('max', HANDLE_BOTTOM);
    handleSlider.setAttribute('min', 0);
    handleSlider.style.width = HANDLE_BOTTOM / BALL_CONTAINER_VIEWBOX_HEIGHT *
        BALL_CONTAINER_IMAGE_HEIGHT + "px";
    handleSlider.oninput = function () {
        this.update();
    }
    handleSlider.update = function () {
        var newValue = handleSlider.value;
        handle.transform({
            y: newValue
        });
        ballBoundary.top = newValue;
        volumeModel.update();
    };

    // Volume Output
    const MAX_VOLUME = 100; // in mL
    var volumeModel = modelFactory.makeMeasureModel(handleSlider, [0, MAX_VOLUME], true);
    var volumeOutput = document.querySelector('#volume .output-single');
    volumeOutput.update = function () {
        this.textContent = Math.round(volumeModel.getMeasurement() * 100) / 100;
    }
    volumeModel.addObserver(volumeOutput);

    /*
    function SVGMovementSlider(root, max) {
        var rootContainer, viewbox;
        var slider = document.createElement('input').setAttribute('type', 'range');
        if (root instanceof SVG.Doc) {
            rootContainer = root.parent();
            viewbox = rootContainer.querySelector('svg').getAttribute('viewBox').split(' ');
        } else {
            rootContainer = root;
            viewbox = root.getAttribute('viewBox').split(' ');
        }
        slider.setAttribute('max', max);
        slider.style.transform = "rotate(90deg)";
        slider.style.transform - origin: "left";
        slider.style.position: "absolute";
        slider.style.left: "10px";
        slider.style.width: max / viewbox[3] *
            rootContainer.height + "px";
        rootContainer.parentNode.insertBefore(slider, rootContainer);
        slider.oninput = function () {
            this.update();
        }
        slider.update = function () {
            var newValue = slider.value;
            handle.transform({
                y: newValue
            });
            ballBoundary.top = newValue;
            volumeOutput.textContent = Math.round((1 - newValue / handleSlider.max) * max *
                100) / 100;
        };
    }
    */

    /* END Handling of Volume section */


    /* START Handling of Temperature section */



    /* END Handling of Temperature section */


    /* START Handling of mouse movement and release */

    // For when svg parts are being used
    document.querySelector('html').onmousemove = function (e) {

        // If the user is currently 'holding the handle'
        if (handleHeld) {
            handleSlider.stepUp(e.movementY / BALL_CONTAINER_IMAGE_HEIGHT *
                BALL_CONTAINER_VIEWBOX_HEIGHT);
            handleSlider.update();
        }
    }
    document.querySelector('html').onmouseup = function () {
        handleHeld = false;
    }

    /* END Handling of mouse movement and release */


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
