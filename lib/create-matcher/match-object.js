"use strict";

const every = require("@sinonjs/commons").prototypes.array.every;
const concat = require("@sinonjs/commons").prototypes.array.concat;
const typeOf = require("@sinonjs/commons").typeOf;

const deepEqualFactory = require("../deep-equal").use;

const identical = require("../identical");
const isMatcher = require("./is-matcher");

const keys = Object.keys;
const getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Matches `actual` with `expectation`
 *
 * @private
 * @param {unknown} actual A value to examine
 * @param {object} expectation An object with properties to match on
 * @param {object} matcher A matcher to use for comparison
 * @returns {boolean} Returns true when `actual` matches all properties in `expectation`
 */
function matchObject(actual, expectation, matcher) {
    const deepEqual = deepEqualFactory(matcher);
    if (actual === null || actual === undefined) {
        return false;
    }

    let expectedKeys = keys(expectation);
    if (typeOf(getOwnPropertySymbols) === "function") {
        expectedKeys = concat(expectedKeys, getOwnPropertySymbols(expectation));
    }

    return every(expectedKeys, (key) => {
        const exp = expectation[key];
        const act = actual[key];

        if (isMatcher(exp)) {
            if (!exp.test(act)) {
                return false;
            }
        } else if (typeOf(exp) === "object") {
            if (identical(exp, act)) {
                return true;
            }
            if (!matchObject(act, exp, matcher)) {
                return false;
            }
        } else if (!deepEqual(act, exp)) {
            return false;
        }

        return true;
    });
}

module.exports = matchObject;
