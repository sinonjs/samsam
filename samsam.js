(typeof define === "function" && define || // AMD
 typeof module === "object" && function (m) { module.exports = m(); } || // Node
 function (m) { this.samsam = m(); } // Browser globals
)(function () {
    var o = Object.prototype;
    var div = typeof document !== "undefined" && document.createElement("div");

    /**
     * Returns the internal [[Class]] by calling Object.prototype.toString
     * with the provided value as this. Return value is a string, naming the
     * internal class, e.g. "Array"
     */
    function getClass(value) {
        return o.toString.call(value).split(/[ \]]/)[1];
    }

    /**
     * @name samsam.isArguments
     * @param Object object
     *
     * Returns ``true`` if ``object`` is an ``arguments`` object,
     * ``false`` otherwise.
     */
    function isArguments(object) {
        if (typeof object !== "object" || typeof object.length !== "number" ||
            getClass(object) === "Array") {
            return false;
        }
        if (typeof object.callee == "function") { return true; }
        try {
            object[object.length] = 6;
            delete object[object.length];
        } catch (e) {
            return true;
        }
        return false;
    }

    /**
     * @name samsam.isElement
     * @param Object object
     *
     * Returns ``true`` if ``object`` is a DOM element node
     */
    function isElement(object) {
        if (!object || object.nodeType !== 1 || !div) { return false; }
        try {
            object.appendChild(div);
            object.removeChild(div);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * @name samsam.keys
     * @param Object object
     *
     * Return an array of own property names.
     */
    function keys(object) {
        var keys = [], prop;
        for (prop in object) {
            if (o.hasOwnProperty.call(object, prop)) { keys.push(prop); }
        }
        return keys;
    }

    /**
     * @name samsam.isDate
     * @param Object value
     *
     * Returns true if the object is a ``Date``, or *date-like*. Duck typing
     * of date objects work by checking that the object has a ``getTime``
     * function whose return value equals the return value from the object's
     * ``valueOf``.
     */
    function isDate(value) {
        return typeof value.getTime == "function" &&
            value.getTime() == value.valueOf();
    }

    function isNaN(value) {
        return value !== value;
    }

    /**
     * @name samsam.equal
     * @param Object obj1
     * @param Object obj2
     * 
     * Returns ``true`` if two objects are strictly equal. Compared to
     * ``===`` there are two exceptions:
     * 
     *   - NaN is considered equal to NaN
     *   - -0 and +0 are not considered equal
     */
    function identical(obj1, obj2) {
        if (obj1 === obj2 || (isNaN(obj1) && isNaN(obj2))) {
            return obj1 !== 0 || 1 / obj1 === 1 / obj2;
        }
    }

    /**
     * @name samsam.deepEqual
     * @param Object expected
     *
     * Deep equal comparison. Two values are "deep equal" if:
     *
     *   - They are equal, according to samsam.equal
     *   - They are both date objects representing the same time
     *   - They are both primitives and ``a == b``
     *   - They are both arrays containing elements that are all deepEqual
     *   - They are objects with the same set of properties, and each property
     *     in ``obj1`` is deepEqual to the corresponding property in ``obj2``
     */
    function deepEqual(obj1, obj2) {
        if (obj1 === obj2 || isNaN(obj1) || isNaN(obj2)) {
            return identical(obj1, obj2);
        }

        // Elements are only equal if identical(expected, actual)
        if (isElement(obj1) || isElement(obj2)) { return false; }

        // If both expected and actual were null, or both were
        // undefined, the identical check would have passed. If any of them
        // are null or undefined at this point, it's a failure
        if (obj1 == null || obj2 == null) { return false; }

        if (isDate(obj1) || isDate(obj2)) {
            return isDate(obj1) && isDate(obj2) &&
                obj1.getTime() === obj2.getTime();
        }

        var type1 = typeof obj1;
        var type2 = typeof obj2;
        var useCoercingEquality = type1 !== "object" || type2 !== "object";

        if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
            if (obj1.toString() !== obj2.toString()) { return false; }
        }

        var class1 = getClass(obj1);
        var class2 = getClass(obj2);

        // Coerce and compare when primitives are involved
        if (useCoercingEquality) {
            return class1 !== "Array" && class2 !== "Array" && obj1 == obj2;
        }

        var keys1 = keys(obj1);
        var keys2 = keys(obj2);
        if (isArguments(obj1) || isArguments(obj2)) {
            if (obj1.length !== obj2.length) { return false; }
        } else {
            if (type1 !== type2 || class1 !== class2 ||
                keys1.length !== keys2.length) {
                return false;
            }
        }

        var key, i, l;

        for (i = 0, l = keys1.length; i < l; i++) {
            key = keys1[i];
            if (!o.hasOwnProperty.call(obj2, key) ||
                !deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        return true;
    }

    function arrayContains(array, subset) {
        var i, l, j, k;
        for (i = 0, l = array.length; i < l; ++i) {
            if (match(array[i], subset[0])) {
                for (j = 0, k = subset.length; j < k; ++j) {
                    if (!match(array[i + j], subset[j])) { return false; }
                }
                return true;
            }
        }
        return false;
    }

    /**
     * @name samsam.match
     * @param Object object
     * @param Object matcher
     *
     * Compare arbitrary value ``object`` with matcher.
     */
    function match(object, matcher) {
        if (matcher && typeof matcher.test === "function") {
            return matcher.test(object);
        }

        if (typeof matcher === "function") {
            return matcher(object) === true;
        }

        if (typeof matcher === "string") {
            matcher = matcher.toLowerCase();
            var notNull = typeof object === "string" || !!object;
            return notNull && ("" + object).toLowerCase().indexOf(matcher) >= 0;
        }

        if (typeof matcher === "number") {
            return matcher == object;
        }

        if (typeof matcher === "boolean") {
            return matcher === object;
        }

        if (getClass(object) === "Array" && getClass(matcher) === "Array") {
            return arrayContains(object, matcher);
        }

        if (matcher && typeof matcher === "object") {
            for (var prop in matcher) {
                if (!match(object[prop], matcher[prop])) {
                    return false;
                }
            }
            return true;
        }

        throw new Error("Matcher was not a string, a number, a " +
                        "function, a boolean or an object");
    }

    return {
        isArguments: isArguments,
        isElement: isElement,
        isDate: isDate,
        identical: identical,
        deepEqual: deepEqual,
        match: match
    };
});
