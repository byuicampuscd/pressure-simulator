var modelFactory = (function () {
    // slider must have a min and max explicitly given
    function makeMeasureModel(slider, measureBound, invertConversion) {

        var measurement, measureMin, measureMax, measureRange;

        // Set up bounds
        if (Array.isArray(measureBound)) {
            measureMin = measureBound[0];
            measureMax = measureBound[1];
        } else {
            measureMin = 0;
            measureMax = measureBound;
        }

        measureRange = (measureMax - measureMin);

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

        // Must be a decimal percentage, or else contain a percent sign
        function setMeasurementByPercentage(value) {

            // If meant to be of the from 100%, should come in as string with the '%' char, convert to decimal
            if (typeof value === "string") {
                value = value.trim();
                if (value.charAt(value.length - 1) === "%") {
                    value = value.substring(0, value.length - 1);
                    value = Number(value) / 100;
                } else {
                    value = Number(value);
                }
            }
            // If not number at this point, remove
            if (typeof value !== "number") {
                return;
            }
            if (0 <= value && value <= 1) {
                measurement = measureMin + value * measureRange;
            }
        }

        function getMeasurement() {
            return measurement;
        }

        var objectToReturn = {
            update: update,
            getMeasurement: getMeasurement,
            setMeasurementByPercentage: setMeasurementByPercentage
        }

        interfaceApplier.makeObservable(objectToReturn, ["update", "setMeasurementByPercentage"]);

        return objectToReturn;
    }

    return {
        makeMeasureModel: makeMeasureModel
    }
}());
