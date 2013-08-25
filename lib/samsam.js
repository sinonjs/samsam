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
     * Used to convert an array to an arguments object.
     */
    function gather() { return arguments; }

    /**
     * Make a deep copy of an object or array, assuring that there is at
     * most one instance of each object or array in the resulting structure.
     * The duplicate references (which might be forming cycles) are
     * replaced with an object of the form
     *       {$ref: PATH}
     * where the PATH is a JSONPath string that locates the first occurance.
     * So,
     *       var a = [];
     *       a[0] = a;
     *       return JSON.stringify(JSON.decycle(a));
     *  produces the string '[{"$ref":"$"}]'.
     *
     *  JSONPath is used to locate the unique object. $ indicates the top
     *  level of the object or array. [NUMBER] or [STRING] indicates a child
     *  member or property.
     * 
     *  This function is copied from:
     *      https://github.com/douglascrockford/JSON-js->cyclic.js 
     */
    function decycle(object) {
        'use strict';

        var objects = [],   // Keep a reference to each unique object or array
            paths = [];     // Keep the path to each unique object or array

        return (function derez(value, path) {

            // The derez recurses through the object, producing the deep copy.

            var i,          // The loop counter
                name,       // Property name
                nu;         // The new object or array

            // typeof null === 'object', so go on if this value is really an
            // object but not one of the weird builtin objects.

            if (typeof value === 'object' && value !== null &&
                    !(value instanceof Boolean) &&
                    !(value instanceof Date)    &&
                    !(value instanceof Number)  &&
                    !(value instanceof RegExp)  &&
                    !(value instanceof String)) {

                // If the value is an object or array, look to see if we have
                // already encountered it. If so, return a $ref/path object.
                // This is a hard way, linear search that will get slower as
                // the number of unique objects grows.

                for (i = 0; i < objects.length; i += 1) {
                    if (objects[i] === value) {
                        return {$ref: paths[i]};
                    }
                }

                // Otherwise, accumulate the unique value and its path.

                objects.push(value);
                paths.push(path);

                // If it is an array, replicate the array.

                // Different from the original implementation is an arguments
                // object now treated as an array and finally converted back
                // to an arguments object.
                // Further are custom properties of an array copied now.
                if (Object.prototype.toString.apply(value)
                        === '[object Array]' || _.isArguments(value)) {
                    nu = [];
                } else {
                    nu = {};
                }

                for (name in value) {
                    if (Object.prototype.hasOwnProperty.call(value, name)) {
                        nu[name] = derez(value[name],
                            path + '[' + JSON.stringify(name) + ']');
                    }
                }

                // Convert array back to an arguments object.
                if (_.isArguments(value)) {
                    nu = gather.apply(null, nu);
                }

                return nu;
            }
            return value;
        }(object, '$'));
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
        deepEqual: function (obj1, obj2) {
            return deepEqual(decycle(obj1), decycle(obj2));
        },
        match: match
    };
});
