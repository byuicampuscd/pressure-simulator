/**
 * Requires:
 * - air.js - provides object called air, which provides functionality for the air balls in svg
 */
var controller = (function () {

    /* START Initial setup */

    const CLOSE_TO_ZERO = 0.00000000000000000000000000000001;
    var measurements = []; // Array to hold arrays of measurements recorded

    air.setup(50, 3);
    air.startAnimation();

    /* END Initial setup */


    /* START Handling of Pressure section */

    const HIGHEST_MARK = 450; // Decided based off issue #6 in GitHub
    var pressureModel = modelFactory.makeMeasureModel(null, 2);
    pressureModel.c = 850; // c for constant, see issue #3 in GitHub for an explanation
    pressureModel.update = function () {
        var V = volumeModel.getMeasurement(); // in cc's

        this.setMeasurement(this.c / V); // in kPa
    }

    // Needle
    var needle = pressureGaugeSVGjs.select('#needle').first();
    pressureModel.addObserver({
        update: function () {
            var rotation = pressureModel.getMeasurement() / HIGHEST_MARK * 270 - 135;
            /*if (Number.isNaN(rotation)) {
                return;
            }*/
            if (rotation > 150) {
                rotation = 150;
            }
            console.log(rotation)
            needle.transform({
                rotation: rotation
            });
        }
    }, "update");

    // Pressure Output
    var pressureOutput = document.querySelector('#pressure p');
    pressureOutput.notify = function () {
        this.textContent = Math.round(pressureModel.getMeasurement() * 100) / 100;
    }
    pressureModel.addObserver(pressureOutput);

    /* END Handling of Pressure section */


    /* START Handling of Volume section */

    const MAX_VOLUME = 20; // in cc
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
    handleSlider.setAttribute('step', 1 /
        (volumeModel.getBounds()[1] * Math.pow(10, volumeModel.getPrecision())));
    var handleLength = HANDLE_BOTTOM / svgInfo.ballContainer.viewbox.height *
        svgInfo.ballContainer.image.height;
    handleSlider.style.width = handleLength + 10 + "px";
    handleSlider.style.top = handleLength - 5 + "px";
    handleSlider.oninput = function () {
        this.update();
    }
    handleSlider.update = function () {
        handle.transform({
            y: HANDLE_BOTTOM * (1 - handleSlider.value)
        });
    };
    interfaceApplier.makeObservable(handleSlider, ["update"]);

    ballBoundary.notify = function () {
        ballBoundary.top = HANDLE_BOTTOM * (1 - handleSlider.value);
    }



    // Volume Output
    var volumeOutput = document.querySelector('#volume p');
    volumeOutput.notify = function () {
        this.textContent = Math.round(volumeModel.getMeasurement() * 100) / 100;
    }

    handleSlider.addObserver(ballBoundary);
    handleSlider.addObserver(volumeModel, "setMeasurementByPercentage", function () {
        return [handleSlider.value];
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

    // Initial values
    volumeModel.addObserver(pressureModel, "update");
    handleSlider.value = 0.5;
    handleSlider.update();


    /* START Handling of mouse movement and release */

    function recordMeasurements() {
        var measurementTable = document.querySelector('table'),
            newTableRow = document.createElement("tr"),
            measureModels = [pressureModel, volumeModel],
            newMeasurementArray = [];

        measureModels.forEach(function (model) {
            newMeasurementArray.push(model.getMeasurement());

            newTableCell = document.createElement("td");
            newTableCell.textContent = (Math.round(model.getMeasurement() * 100) / 100).toFixed(2);
            newTableRow.appendChild(newTableCell);
        });

        measurements.push(newMeasurementArray);
        measurementTable.appendChild(newTableRow);
        updatePlot(1, 0);
    }

    function updatePlot(measurementIndexX, measurementIndexY) {
        var plotSelector = '#dataplot',
            pointsToPlot = [];

        measurements.forEach(function (anArray) {
            // Better with map or reduce?
            pointsToPlot.push([anArray[measurementIndexX], anArray[measurementIndexY]]);
        })

        functionPlot({
            target: '#dataplot',
            title: "Graph of the Data",
            width: 300,
            height: 300,
            data: [{
                points: pointsToPlot,
                fnType: 'points',
                graphType: 'scatter'
            }]
        });
    }

    // For when svg parts are being used
    document.querySelector('html').onmousemove = function (e) {

        var slider, model;

        // What the user is currently 'holding'
        if (handleHeld) {
            slider = handleSlider;
            model = volumeModel;
        } else {
            return;
        }

        // If something is being held, update the slider
        slider.stepUp(-e.movementY / Number(slider.style.width.slice(0, -2)) *
            (model.getBounds()[1] * Math.pow(10, model.getPrecision())));
        slider.update();
    }
    document.querySelector('html').onmouseup = function () {

        if (handleHeld) {
            handleHeld = false;

            recordMeasurements();
        }
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
