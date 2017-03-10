var modelFactory = (function () {

    // It should be noted that the precision is only used as desired for final output
    function makeMeasureModel(measureBound, precision) {

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

        /* START Methods to include in object returned */

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

        function setMeasurement(newMeasurement) {
            measurement = newMeasurement;
        }

        function getMeasurement() {
            return measurement;
        }

        function getBounds() {
            return [measureMin, measureMax];
        }

        function getPrecision() {
            return precision;
        }

        var objectToReturn = {
            getMeasurement: getMeasurement,
            getBounds: getBounds,
            getPrecision: getPrecision,
            setMeasurement: setMeasurement
        }
        if (measureMax || measureMax === 0) {
            objectToReturn.setMeasurementByPercentage = setMeasurementByPercentage;
        }

        interfaceApplier.makeObservable(objectToReturn, ["setMeasurementByPercentage"]);

        return objectToReturn;
    }

    return {
        makeMeasureModel: makeMeasureModel
    }
}());
