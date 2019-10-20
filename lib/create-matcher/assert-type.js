"use strict";

var type = require("type-detect");

/**
 * Ensures that value is of type
 *
 * @private
 * @param {*} value A value to examine
 * @param {string} expected A basic JavaScript type to compare to, e.g. "object", "string"
 * @param {string} name A string to use for the error message
 * @throws {TypeError} If value is not of the expected type
 * @returns {undefined}
 */
function assertType(value, expected, name) {
    var actual = type(value);
    if (actual !== expected) {
        throw new TypeError(
            "Expected type of " +
                name +
                " to be " +
                expected +
                ", but was " +
                actual
        );
    }
}

module.exports = assertType;
