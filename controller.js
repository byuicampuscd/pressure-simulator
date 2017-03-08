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

    const MAX_VOLUME = 100; // in mL
    var volumeModel = modelFactory.makeMeasureModel([0, MAX_VOLUME], 2);

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
    handleSlider.setAttribute('max', 1);
    handleSlider.setAttribute('min', 0);
    handleSlider.style.width = HANDLE_BOTTOM / svgInfo.ballContainer.viewbox.height *
        svgInfo.ballContainer.image.height + "px";
    handleSlider.setAttribute('step', 1 /
        (volumeModel.getBounds()[1] * Math.pow(10, volumeModel.getPrecision())));
    handleSlider.oninput = function () {
        this.update();
    }
    handleSlider.update = function () {
        handle.transform({
            y: HANDLE_BOTTOM * handleSlider.value
        });
    };
    interfaceApplier.makeObservable(handleSlider, ["update"]);

    ballBoundary.notify = function () {
        ballBoundary.top = HANDLE_BOTTOM * handleSlider.value;
    }



    // Volume Output
    var volumeOutput = document.querySelector('#volume p');
    volumeOutput.notify = function () {
        this.textContent = Math.round(volumeModel.getMeasurement() * 100) / 100;
    }

    handleSlider.addObserver(ballBoundary);
    handleSlider.addObserver(volumeModel, "setMeasurementByPercentage", function () {
        return [1 - handleSlider.value];
    });
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

    const TEMPERATURE_BOUNDS = [0, 600]; // in degrees Celsius
    var temperatureModel = modelFactory.makeMeasureModel(TEMPERATURE_BOUNDS, 2);

    // Temperature bar
    var bar = thermometerSVGjs.select('#bar').first();
    var barHeld = false; // Flag for mouse events
    bar.mousedown(function () {
        barHeld = true;
    })

    // Bar Slider
    var barSlider = document.querySelector('#temperature .slider-vertical');
    barSlider.setAttribute('max', 1);
    barSlider.setAttribute('min', 0);
    barSlider.style.width = bar.height() / svgInfo.thermometer.viewbox.height *
        svgInfo.thermometer.image.height + "px";
    barSlider.setAttribute('step', 1 /
        (temperatureModel.getBounds()[1] * Math.pow(10, temperatureModel.getPrecision())));
    barSlider.oninput = function () {
        this.update();
    }
    barSlider.update = function () {
        bar.transform({
            scaleY: 1 - Number(barSlider.value),
            cy: bar.y() + bar.height()
        });
    };
    interfaceApplier.makeObservable(barSlider, ["update"]);


    // Temperature Output
    var temperatureOutput = document.querySelector('#temperature p');
    temperatureOutput.notify = function () {
        this.textContent = Math.round(temperatureModel.getMeasurement() * 100) / 100;
    }

    barSlider.addObserver(temperatureModel, "setMeasurementByPercentage", function () {
        return [1 - barSlider.value];
    });
    temperatureModel.addObserver(temperatureOutput);

    /* END Handling of Temperature section */


    /* START Handling of mouse movement and release */

    // For when svg parts are being used
    document.querySelector('html').onmousemove = function (e) {

        var slider, model;

        // What the user is currently 'holding'
        if (handleHeld) {
            slider = handleSlider;
            model = volumeModel;
        } else if (barHeld) {
            slider = barSlider;
            model = temperatureModel;
        } else {
            return;
        }

        // If something is being held, update the slider
        slider.stepUp(e.movementY / Number(slider.style.width.slice(0, -2)) *
            (model.getBounds()[1] * Math.pow(10, model.getPrecision())));
        slider.update();
    }
    document.querySelector('html').onmouseup = function () {
        handleHeld = false;
        barHeld = false;
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
