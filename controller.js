/* JSDocs command: jsdoc -p air.js controller.js modelFactory.js interfaces.js */

/**
 * This is to document the use of the external script to work with svgs
 * @external SVGjs
 * @see https://github.com/svgdotjs/svg.js
 */

/**
 * This is to document the use of the external script that handles the plot
 * @external functionPlot
 * @see http://maurizzzio.github.io/function-plot/
 */

/**
 * The Controller for the app.
 *
 * @module controller
 * 
 * @requires air - provides object called air, which provides functionality for the air balls in svg
 * @requires external:SVGjs
 * @requires external:functionPlot
 */
(function () {

    /* START Initial setup */

    const CLOSE_TO_ZERO = 0.00000000000000000000000000000001;
    var measurements = []; // Array to hold arrays of measurements recorded

    /** 
     * @member {Object} settings 
     * Settings for use by the app 
     * 
     * @property {Object} balls - Contains the setup amounts for the {@link module:air~setup air module}
     * @property {Object} plot - Contains the settings for the {@link external:functionPlot functionPlot}, 
     *                           used to create/update the plot
     */
    var settings = {
        noise: .03, //must be a positive number
        balls: {
            ballCount: 150,
            ballInitialSpeed: 25,
            ballSize: 20
        },
        plot: {
            target: '#dataplot',
            //title: "Graph of the Data",
            width: 400,
            height: 550,
            grid: true,
            disableZoom: true,
            xAxis: {
                label: 'Volume (cc)',
                domain: [0, 22]
            },
            yAxis: {
                label: 'Pressure (kPa)',
                domain: [0, 300]
            },
            data: [{
                points: measurements,
                fnType: 'points',
                graphType: 'scatter'
            }]
        }
    }

    air.setup(settings.balls);
    air.startAnimation();

    /* END Initial setup */


    /* START Handling of Pressure section */

    /** 
     * This is the model for the pressure part of the app. It holds the measurement for
     * the pressure and precision level. Note that its bounds are null, since it changes
     * solely based off the volume.
     *
     * @member {MeasureModel} pressureModel
     * @private
     */
    var pressureModel = modelFactory.makeMeasureModel(null, 2);
    pressureModel.c = 850; // c for constant, see issue #3 in GitHub for an explanation
    pressureModel.update = function () {
        var V = volumeModel.getMeasurement(); // in cc's
        if (settings.noise === 0) {
            this.setMeasurement(Number((this.c / V).toFixed(this.getPrecision()))); // in kPa
        } else {
            var measurement = this.c / V,
                max = measurement * settings.noise,
                min = -max,
                variance = Math.random() * (max - min) + min,
                finalMeasurement = Number((variance + measurement).toFixed(this.getPrecision()));
            this.setMeasurement(finalMeasurement); // in kPa
        }
    }

    const HIGHEST_MARK = 450; // Highest mark on gauge decided based off issue #6 in GitHub

    // Needle
    var needle = gaugeSVGjs.select('#needle').first();
    pressureModel.addObserver({
        update: function () {
            var rotation = pressureModel.getMeasurement() / HIGHEST_MARK * 270 - 135;
            /*if (Number.isNaN(rotation)) {
                return;
            }*/
            if (rotation > 145) {
                rotation = 145;
            }
            needle.transform({
                rotation: rotation
            });
        }
    }, "update");

    // Pressure Output
    var pressureOutput = document.getElementById('pressure-output');
    pressureOutput.notify = function () {
        this.textContent = Math.round(pressureModel.getMeasurement() * 100) / 100;
    }
    pressureModel.addObserver(pressureOutput);
    pressureModel.addObserver(air, "setBallSpeed", function () {

        var newSpeed = 10 + 10 * pressureModel.getMeasurement() / 42.5;

        if (newSpeed < 100) {
            return [newSpeed];
        } else {
            return [25]; // To keep them from disappearing or going out of bounds
        }
    });

    /* END Handling of Pressure section */


    /* START Handling of Volume section */

    const MAX_VOLUME = 20; // in cc
    var volumeModel = modelFactory.makeMeasureModel([0, MAX_VOLUME], 1);

    var ballBoundary = air.getBoundary();
    // Also set the bottom boundary for the handle
    const HANDLE_BOUND = ballBoundary.right - 20;

    // Handle
    var handle = syringeSVGjs.select('#handle').first();
    var handleHeld = false; // Flag for mouse events
    handle.mousedown(function (e) {
        handleHeld = true;
        document.body.style.cursor = "auto";
    })

    //    handle.mouseup(function (e) {
    //        handleHeld = false;
    //        document.body.style.cursor = "auto";
    //    })

    /* Handle Slider*/
    var handleSlider = document.querySelector('.volume-slider');
    handleSlider.setAttribute('max', 1);
    handleSlider.setAttribute('min', 0);
    handleSlider.setAttribute('step', 1 / (volumeModel.getBounds()[1] * Math.pow(10, volumeModel.getPrecision())));
    var handleLength = HANDLE_BOUND / svgInfo.pressure.viewbox.height * svgInfo.pressure.image.height;
    handleSlider.style.width = handleLength + 10 + "px";

    handleSlider.oninput = function () {
        this.update();
    }
    handleSlider.onchange = recordMeasurements;
    handleSlider.update = function () {
        handle.transform({
            x: HANDLE_BOUND * (1 - handleSlider.value)
        });
    };
    interfaceApplier.makeObservable(handleSlider, ["update"]);

    ballBoundary.notify = function () {
        ballBoundary.left = HANDLE_BOUND * (1 - handleSlider.value);
    }



    // Volume Input
    var volumeInput = document.getElementById('volume-input-box');
    volumeInput.setAttribute('max', 20);
    volumeInput.setAttribute('min', 0);

    volumeInput.update = function () {
        handle.transform({
            x: HANDLE_BOUND * (1 - handleSlider.value)
        })
    }

    //make the ballBoundry listen to the volumeinput 
    interfaceApplier.makeObservable(volumeInput, ["update"]);
    volumeInput.addObserver(ballBoundary);

    //Only called when Volume is updated thru the input box
    function updateAnimation(volumeInputValue) {

        // Update the model
        volumeModel.setMeasurement(Number(volumeInputValue.toFixed(2)));

        // Convert the value into a percentage
        var percentage = Number((volumeInputValue / 20).toFixed(2));

        // Write the sliderElement's value as the new percentage
        document.querySelector('.volume-slider').value = percentage;

        // For the plunger to move
        volumeInput.update();

        // Output measurements to table
        recordMeasurements();
        return;
    }

    volumeInput.onchange = function () {
        var volumeValue = Number(this.value);
        // This code will ensure correct values are computed
        if (volumeValue <= 20 && volumeValue >= 0) {
            updateAnimation(volumeValue);
        } else if (volumeValue > 20) {
            volumeValue = 20
            updateAnimation(volumeValue)
        } else if (volumeValue < 0) {
            volumeValue = 0;
            updateAnimation(volumeValue);
        }

        return;
    }


    //interfaceApplier.makeObservable(volumeInput, ["update"]);
    //volumeInput.addObserver(ballBoundary);
    /*volumeInput.addObserver(volumeModel, "setMeasurementByPercentage", function () {
        return [volumeInput.value];
    });*/
    //volumeModel.addObserver(volumeInput);


    // Volume Output
    var volumeOutput = document.getElementById('volume-input-box');
    volumeOutput.notify = function () {
        this.value = Math.round(volumeModel.getMeasurement() * 100) / 100;
    }

    handleSlider.addObserver(ballBoundary);
    handleSlider.addObserver(volumeModel, "setMeasurementByPercentage", function () {
        volumeInput.value = Math.round(volumeModel.getMeasurement() * 100) / 100;
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

    updatePlot();


    /* START Handling of mouse movement and release */


    function enableDownload(measurements) {

        var csvList = d3.csv.format(measurements, ['Volume', 'Pressure']);
        console.log(csvList);
        //document.getElementById('download').href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvList);
        //document.getElementById('download').classList.remove('disabled');
    }

    function recordMeasurements() {
        var measurementTableBody = document.querySelector('table tbody'),
            newTableRow = document.createElement("tr"),
            measureModels = [volumeModel, pressureModel],
            newMeasurementArray = [];

        measureModels.forEach(function (model) {
            newMeasurementArray.push(model.getMeasurement());

            newTableCell = document.createElement("td");
            newTableCell.textContent = (Math.round(model.getMeasurement() * 100) / 100).toFixed(2);
            newTableRow.appendChild(newTableCell);
        });

        measurements.push(newMeasurementArray);
        measurementTableBody.appendChild(newTableRow);
        updatePlot(1, 0);
        enableDownload(measurements);
    }

    /**
     * Updates the plot according to the {@link module:controller~settings settings} provided
     * 
     * @function updatePlot
     * @private
     **/
    function updatePlot() {
        functionPlot(settings.plot);
        increasePointSize();
    }

    // For when svg parts are being used
    document.querySelector('html').onmousemove = function (e) {

        var slider, model, stepsToMove;

        // What the user is currently 'holding'
        if (handleHeld) {
            slider = handleSlider;
            model = volumeModel;
        } else {
            return;
        }

        // If something is being held, update the slider
        stepsToMove = Math.round(-e.movementX / Number(slider.style.width.slice(0, -2)) *
            (model.getBounds()[1] * Math.pow(10, model.getPrecision())));
        slider.stepUp(stepsToMove);
        slider.update();
    }
    document.querySelector('html').onmouseup = function () {

        if (handleHeld) {
            handleHeld = false;
            document.body.style.cursor = "auto";

            recordMeasurements();
        }
    }

    /***
     *Increases the radius of the svg points to 3 instead of 1 so that you can actually see them
     ****/
    function increasePointSize() {
        var circles = document.querySelectorAll('g.graph>circle');
        circles.forEach(function (circle) {
            circle.r.baseVal.value = 3;
        })
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
