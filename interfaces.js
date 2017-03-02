var interfaceApplier = (function () {

    // valueChangers is an array of strings naming the methods that change object values
    function makeObservable(object, valueChangers) {

        var observers = [];

        var updateObservers = function () {
            // Update the observers
            observers.forEach(function (observer) {
                observer.update();
            });
        }

        object.addObserver = function (observer) {
            observers.push(observer);
        }

        valueChangers.forEach(function (methodName) {
            var oldMethod = object[methodName];
            alert(Object.getOwnPropertyNames(object))
            object[methodName] = function () {
                oldMethod(arguments);

                updateObservers();
            }
        });

        return object;
    }

    return {
        makeObservable: makeObservable
    }
}());
