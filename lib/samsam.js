((typeof define === "function" && define.amd && function (m) {
    define("samsam", ["lodash"], m);
}) || (typeof module === "object" &&
       typeof require === "function" && function (m) {
        module.exports = m(require("lodash"));
    }) || function (m) { this.samsam = m(_); }
)(function (_) {
    var o = Object.prototype;
    var div = typeof document !== "undefined" && document.createElement("div");

    function isNaN(value) {
        // Unlike global isNaN, this avoids type coercion
        // typeof check avoids IE host object issues, hat tip to
        // lodash
        var val = value; // JsLint thinks value !== value is "weird"
        return typeof value === "number" && value !== val;
    }

    function getClass(value) {
        // Returns the internal [[Class]] by calling Object.prototype.toString
        // with the provided value as this. Return value is a string, naming the
        // internal class, e.g. "Array"
        return o.toString.call(value).split(/[ \]]/)[1];
    }

    /**
     * @name samsam.isElement
     * @param Object object
     *
     * Returns ``true`` if ``object`` is a DOM element node. Unlike
     * Underscore.js/lodash, this function will return ``false`` if ``object``
     * is an *element-like* object, i.e. a regular object with a ``nodeType``
     * property that holds the value ``1``.
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
     * @name samsam.isNegZero
     * @param Object value
     *
     * Returns ``true`` if ``value`` is ``-0``.
     */
    function isNegZero(value) {
        return value === 0 && 1 / value === -Infinity;
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
            return obj1 !== 0 || isNegZero(obj1) === isNegZero(obj2);
        }
    }

    /**
     * @name samsam.deepEqual
     * @param Object obj1
     * @param Object obj2
     *
     * Deep equal comparison. Two values are "deep equal" if:
     *
     *   - They are equal, according to samsam.identical
     *   - They are both date objects representing the same time
     *   - They are both arrays containing elements that are all deepEqual
     *   - They are objects with the same set of properties, and each property
     *     in ``obj1`` is deepEqual to the corresponding property in ``obj2``
     */
    function deepEqual(obj1, obj2) {
        var type1 = typeof obj1;
        var type2 = typeof obj2;

        // == null also matches undefined
        if (obj1 === obj2 ||
                isNaN(obj1) || isNaN(obj2) ||
                obj1 == null || obj2 == null ||
                type1 !== "object" || type2 !== "object") {
            return identical(obj1, obj2);
        }

        // Elements are only equal if identical(expected, actual)
        if (isElement(obj1) || isElement(obj2)) { return false; }

        var isDate1 = _.isDate(obj1), isDate2 = _.isDate(obj2);
        if (isDate1 || isDate2) {
            if (!isDate1 || !isDate2 || obj1.getTime() !== obj2.getTime()) {
                return false;
            }
        }

        if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
            if (obj1.toString() !== obj2.toString()) { return false; }
        }

        var class1 = getClass(obj1);
        var class2 = getClass(obj2);
        var keys1 = _.keys(obj1);
        var keys2 = _.keys(obj2);

        if (_.isArguments(obj1) || _.isArguments(obj2)) {
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

    var match;

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
    match = function match(object, matcher) {
        if (matcher && typeof matcher.test === "function") {
            return matcher.test(object);
        }

        if (typeof matcher === "function") {
            return matcher(object) === true;
        }

        if (typeof matcher === "string") {
            matcher = matcher.toLowerCase();
            var notNull = typeof object === "string" || !!object;
            return notNull &&
                (String(object)).toLowerCase().indexOf(matcher) >= 0;
        }

        if (typeof matcher === "number") {
            return matcher === object;
        }

        if (typeof matcher === "boolean") {
            return matcher === object;
        }

        if (getClass(object) === "Array" && getClass(matcher) === "Array") {
            return arrayContains(object, matcher);
        }

        if (matcher && typeof matcher === "object") {
            var prop;
            for (prop in matcher) {
                if (!match(object[prop], matcher[prop])) {
                    return false;
                }
            }
            return true;
        }

        throw new Error("Matcher was not a string, a number, a " +
                        "function, a boolean or an object");
    };

    return {
        isElement: isElement,
        isNegZero: isNegZero,
        identical: identical,
        deepEqual: deepEqual,
        match: match
    };
});
