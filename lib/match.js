"use strict";

var valueToString = require("@sinonjs/commons").valueToString;
var indexOf = require("@sinonjs/commons").prototypes.string.indexOf;
var forEach = require("@sinonjs/commons").prototypes.array.forEach;

var deepEqual = require("./deep-equal").use(match); // eslint-disable-line no-use-before-define
var getClass = require("./get-class");
var isDate = require("./is-date");
var isSet = require("./is-set");
var isSubset = require("./is-subset");
var createMatcher = require("./create-matcher");

function arrayContains(array, subset, compare) {
    if (subset.length === 0) {
        return true;
    }
    var i, l, j, k;
    for (i = 0, l = array.length; i < l; ++i) {
        if (compare(array[i], subset[0])) {
            for (j = 0, k = subset.length; j < k; ++j) {
                if (i + j >= l) {
                    return false;
                }
                if (!compare(array[i + j], subset[j])) {
                    return false;
                }
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
// eslint-disable-next-line complexity
function match(object, matcherOrValue) {
    if (matcherOrValue && typeof matcherOrValue.test === "function") {
        return matcherOrValue.test(object);
    }

    if (typeof matcherOrValue === "function") {
        return matcherOrValue(object) === true;
    }

    if (typeof matcherOrValue === "string") {
        var notNull = typeof object === "string" || Boolean(object);
        return (
            notNull &&
            indexOf(
                valueToString(object).toLowerCase(),
                matcherOrValue.toLowerCase()
            ) >= 0
        );
    }

    if (typeof matcherOrValue === "number") {
        return matcherOrValue === object;
    }

    if (typeof matcherOrValue === "boolean") {
        return matcherOrValue === object;
    }

    if (typeof matcherOrValue === "undefined") {
        return typeof object === "undefined";
    }

    if (matcherOrValue === null) {
        return object === null;
    }

    if (object === null) {
        return false;
    }

    if (isSet(object)) {
        return isSubset(matcherOrValue, object, match);
    }

    if (getClass(object) === "Array" && getClass(matcherOrValue) === "Array") {
        return arrayContains(object, matcherOrValue, match);
    }

    if (isDate(matcherOrValue)) {
        return isDate(object) && object.getTime() === matcherOrValue.getTime();
    }

    if (matcherOrValue && typeof matcherOrValue === "object") {
        if (matcherOrValue === object) {
            return true;
        }
        if (typeof object !== "object") {
            return false;
        }
        var prop;
        // eslint-disable-next-line guard-for-in
        for (prop in matcherOrValue) {
            var value = object[prop];
            if (
                typeof value === "undefined" &&
                typeof object.getAttribute === "function"
            ) {
                value = object.getAttribute(prop);
            }
            if (
                matcherOrValue[prop] === null ||
                typeof matcherOrValue[prop] === "undefined"
            ) {
                if (value !== matcherOrValue[prop]) {
                    return false;
                }
            } else if (
                typeof value === "undefined" ||
                !deepEqual(value, matcherOrValue[prop])
            ) {
                return false;
            }
        }
        return true;
    }

    throw new Error(
        "Matcher was not a string, a number, a " +
            "function, a boolean or an object"
    );
}

forEach(Object.keys(createMatcher), function(key) {
    match[key] = createMatcher[key];
});

module.exports = match;
