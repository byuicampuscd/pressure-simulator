var modelFactory = (function () {

    // slider must have a min and max explicitly given
    function makeMeasureModel(slider, measureBound, invertConversion) {

        var measurement, measureMin, measureMax;

        // Set up bounds
        if (Array.isArray(measureBound)) {
            measureMin = measureBound[0];
            measureMax = measureBound[1];
        } else {
            measureMin = 0;
            measureMax = measureBound;
        }

        // Make sure invertConversion is a 0 or 1
        if (invertConversion === undefined) {
            invertConversion = 0;
        }

        /* START Methods to include in object returned */
        function update() {

            // Convert slider's value to and update measurement value
            measurement = measureMin + Math.abs(invertConversion -
                    (slider.value - slider.min) / (slider.max - slider.min)) *
                (measureMax - measureMin);
        }

        function getMeasurement() {
            return measurement;
        }

        var objectToReturn = {
            update: update,
            getMeasurement: getMeasurement
        }

        interfaceApplier.makeObservable(objectToReturn, ["update"]);

        return objectToReturn;
    }

    return {
        makeMeasureModel: makeMeasureModel
    }
}());
