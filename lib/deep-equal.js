"use strict";

const valueToString = require("@sinonjs/commons").valueToString;
const className = require("@sinonjs/commons").className;
const typeOf = require("@sinonjs/commons").typeOf;
const arrayProto = require("@sinonjs/commons").prototypes.array;
const mapForEach = require("@sinonjs/commons").prototypes.map.forEach;

const getClass = require("./get-class");
const identical = require("./identical");
const isArguments = require("./is-arguments");
const isArrayType = require("./is-array-type");
const isDate = require("./is-date");
const isElement = require("./is-element");
const isIterable = require("./is-iterable");
const isMap = require("./is-map");
const isNaN = require("./is-nan");
const isObject = require("./is-object");
const isSet = require("./is-set");
const isSubset = require("./is-subset");

const concat = arrayProto.concat;
const every = arrayProto.every;
const push = arrayProto.push;

const getTime = Date.prototype.getTime;
const indexOf = arrayProto.indexOf;
const objectKeys = Object.keys;
const getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * We explicitly want to get props on proto chain
 *
 * Objects such as URL in the browser do not have any
 * enumerable keys of its own. All meaningful props
 * to compare are enumerable getters further up the chain
 * @param {object} object
 * @returns {Array<string>} the list of enumerable keys
 */
function allEnumerableKeysInProtoChain(object) {
    const enumerableKeys = [];

    // eslint-disable-next-line
    for (const key in object) {
        enumerableKeys.push(key);
    }
    return enumerableKeys;
}

/**
 * Array-like values should only compare their own enumerable keys.
 * @param {object} object
 * @returns {boolean} `true` when prototype-chain keys should be compared
 */
function shouldComparePrototypeEnumerableKeys(object) {
    return !isArrayType(object) && !isArguments(object);
}

/**
 * Gets the enumerable string keys relevant for deep equality.
 * @param {object} object
 * @returns {Array<string>} enumerable string keys to compare
 */
function getEnumerableStringKeys(object) {
    // Buffers and typed arrays can expose inherited accessors like `offset`.
    // Those values reflect pooled backing-store layout, not logical content.
    return shouldComparePrototypeEnumerableKeys(object)
        ? allEnumerableKeysInProtoChain(object)
        : objectKeys(object);
}

/**
 * Checks whether all expected enumerable string keys are present.
 * @param {Array<string>} actualKeys
 * @param {Array<string>} expectedKeys
 * @returns {boolean} `true` when all expected keys are present
 */
function hasAllEnumerableStringKeys(actualKeys, expectedKeys) {
    return every(expectedKeys, (key) => indexOf(actualKeys, key) !== -1);
}

/**
 * Deep equal comparison. Two values are "deep equal" when:
 *
 * - They are equal, according to samsam.identical
 * - They are both date objects representing the same time
 * - They are both arrays containing elements that are all deepEqual
 * - They are objects with the same set of properties, and each property
 * in ``actual`` is deepEqual to the corresponding property in ``expectation``
 *
 * Supports cyclic objects.
 * @alias module:samsam.deepEqual
 * @param {unknown} actual The object to examine
 * @param {unknown} expectation The object actual is expected to be equal to
 * @param {object} match A value to match on
 * @returns {boolean} Returns true when actual and expectation are considered equal
 */
function deepEqualCyclic(actual, expectation, match) {
    // used for cyclic comparison
    // contain already visited objects
    const actualObjects = [];
    const expectationObjects = [];
    // contain pathes (position in the object structure)
    // of the already visited objects
    // indexes same as in objects arrays
    const actualPaths = [];
    const expectationPaths = [];
    // contains combinations of already compared objects
    // in the manner: { "$1['ref']$2['ref']": true }
    const compared = {};

    // does the recursion for the deep equal check
    // eslint-disable-next-line complexity
    return (function deepEqual(
        actualObj,
        expectationObj,
        actualPath,
        expectationPath,
    ) {
        // If both are matchers they must be the same instance in order to be
        // considered equal If we didn't do that we would end up running one
        // matcher against the other
        if (match && match.isMatcher(expectationObj)) {
            if (match.isMatcher(actualObj)) {
                return actualObj === expectationObj;
            }
            return expectationObj.test(actualObj);
        }

        const actualType = typeof actualObj;
        const expectationType = typeof expectationObj;

        if (
            actualObj === expectationObj ||
            isNaN(actualObj) ||
            isNaN(expectationObj) ||
            actualObj === null ||
            expectationObj === null ||
            actualObj === undefined ||
            expectationObj === undefined ||
            actualType !== "object" ||
            expectationType !== "object"
        ) {
            return identical(actualObj, expectationObj);
        }

        // Elements are only equal if identical(expected, actual)
        if (isElement(actualObj) || isElement(expectationObj)) {
            return false;
        }

        const isActualDate = isDate(actualObj);
        const isExpectationDate = isDate(expectationObj);
        if (isActualDate || isExpectationDate) {
            if (
                !isActualDate ||
                !isExpectationDate ||
                getTime.call(actualObj) !== getTime.call(expectationObj)
            ) {
                return false;
            }
        }

        if (actualObj instanceof RegExp && expectationObj instanceof RegExp) {
            if (valueToString(actualObj) !== valueToString(expectationObj)) {
                return false;
            }
        }

        if (actualObj instanceof Promise && expectationObj instanceof Promise) {
            return actualObj === expectationObj;
        }

        if (actualObj instanceof Error && expectationObj instanceof Error) {
            return actualObj === expectationObj;
        }

        const actualClass = getClass(actualObj);
        const expectationClass = getClass(expectationObj);
        const actualKeys = getEnumerableStringKeys(actualObj);
        const expectationKeys = getEnumerableStringKeys(expectationObj);
        const actualName = className(actualObj);
        const expectationName = className(expectationObj);
        const expectationSymbols =
            typeOf(getOwnPropertySymbols) === "function"
                ? getOwnPropertySymbols(expectationObj)
                : /* c8 ignore next: cannot collect coverage for engine that doesn't support Symbol */
                  [];
        const expectationKeysAndSymbols = concat(
            expectationKeys,
            expectationSymbols,
        );

        if (isArguments(actualObj) || isArguments(expectationObj)) {
            if (actualObj.length !== expectationObj.length) {
                return false;
            }
        } else {
            if (
                actualType !== expectationType ||
                actualClass !== expectationClass ||
                actualKeys.length !== expectationKeys.length ||
                !hasAllEnumerableStringKeys(actualKeys, expectationKeys) ||
                !hasAllEnumerableStringKeys(expectationKeys, actualKeys) ||
                (actualName &&
                    expectationName &&
                    actualName !== expectationName)
            ) {
                return false;
            }
        }

        if (isSet(actualObj) || isSet(expectationObj)) {
            if (
                !isSet(actualObj) ||
                !isSet(expectationObj) ||
                actualObj.size !== expectationObj.size
            ) {
                return false;
            }

            return isSubset(actualObj, expectationObj, deepEqual);
        }

        if (isMap(actualObj) || isMap(expectationObj)) {
            if (
                !isMap(actualObj) ||
                !isMap(expectationObj) ||
                actualObj.size !== expectationObj.size
            ) {
                return false;
            }

            let mapsDeeplyEqual = true;
            mapForEach(actualObj, (value, key) => {
                mapsDeeplyEqual &&= deepEqualCyclic(
                    value,
                    expectationObj.get(key),
                );
            });

            return mapsDeeplyEqual;
        }

        // jQuery objects have iteration protocols
        // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
        // But, they don't work well with the implementation concerning iterables below,
        // so we will detect them and use jQuery's own equality function
        /* c8 ignore start: this can only be tested in the `test-headless` script */
        if (
            typeof actualObj.jquery === "string" &&
            typeof actualObj.is === "function"
        ) {
            return actualObj.is(expectationObj);
        }
        /* c8 ignore stop */

        const isActualNonArrayIterable =
            isIterable(actualObj) &&
            !isArrayType(actualObj) &&
            !isArguments(actualObj);
        const isExpectationNonArrayIterable =
            isIterable(expectationObj) &&
            !isArrayType(expectationObj) &&
            !isArguments(expectationObj);
        if (isActualNonArrayIterable || isExpectationNonArrayIterable) {
            const actualArray = Array.from(actualObj);
            const expectationArray = Array.from(expectationObj);
            if (actualArray.length !== expectationArray.length) {
                return false;
            }

            let arrayDeeplyEquals = true;
            every(actualArray, (key) => {
                arrayDeeplyEquals &&= deepEqualCyclic(
                    actualArray[key],
                    expectationArray[key],
                );
            });

            return arrayDeeplyEquals;
        }

        return every(expectationKeysAndSymbols, (key) => {
            const actualValue = actualObj[key];
            const expectationValue = expectationObj[key];
            const actualObject = isObject(actualValue);
            const expectationObject = isObject(expectationValue);
            // determines, if the objects were already visited
            // (it's faster to check for isObject first, than to
            // get -1 from getIndex for non objects)
            const actualIndex = actualObject
                ? indexOf(actualObjects, actualValue)
                : -1;
            const expectationIndex = expectationObject
                ? indexOf(expectationObjects, expectationValue)
                : -1;
            // determines the new paths of the objects
            // - for non cyclic objects the current path will be extended
            //   by current property name
            // - for cyclic objects the stored path is taken
            const newActualPath =
                actualIndex !== -1
                    ? actualPaths[actualIndex]
                    : `${actualPath}[${JSON.stringify(key)}]`;
            const newExpectationPath =
                expectationIndex !== -1
                    ? expectationPaths[expectationIndex]
                    : `${expectationPath}[${JSON.stringify(key)}]`;
            const combinedPath = newActualPath + newExpectationPath;

            // stop recursion if current objects are already compared
            if (compared[combinedPath]) {
                return true;
            }

            // remember the current objects and their paths
            if (actualIndex === -1 && actualObject) {
                push(actualObjects, actualValue);
                push(actualPaths, newActualPath);
            }
            if (expectationIndex === -1 && expectationObject) {
                push(expectationObjects, expectationValue);
                push(expectationPaths, newExpectationPath);
            }

            // remember that the current objects are already compared
            if (actualObject && expectationObject) {
                compared[combinedPath] = true;
            }

            // End of cyclic logic

            // neither actualValue nor expectationValue is a cycle
            // continue with next level
            return deepEqual(
                actualValue,
                expectationValue,
                newActualPath,
                newExpectationPath,
            );
        });
    })(actual, expectation, "$1", "$2");
}

deepEqualCyclic.use = function (match) {
    return function deepEqual(a, b) {
        return deepEqualCyclic(a, b, match);
    };
};

module.exports = deepEqualCyclic;
