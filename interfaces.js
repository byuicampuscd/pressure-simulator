var interfaceApplier = (function () {

    // valueChangers is an array of strings naming the methods that change object values
    function makeObservable(object, valueChangers) {

        var observers = [];

        var notifyObservers = function () {
            // Notify the observers
            observers.forEach(function (observer, i) {
                /*if (Array.isArray(observer.sender()))
                    alert(typeof observer.sender()[0])*/
                observer.object[observer.methodToCall].apply(observer.object, observer.sender());
            });
        }

        object.addObserver = function (observer, methodToCall, sender) {
            observers.push({
                object: observer,
                methodToCall: methodToCall || "notify",
                sender: sender || function () {
                    return undefined
                }
            });
        }

        valueChangers.forEach(function (methodName) {
            var oldMethod = object[methodName];
            object[methodName] = function () {
                oldMethod(arguments);

                notifyObservers();
            }
        });

        return object;
    }

    return {
        makeObservable: makeObservable
    }
}());
