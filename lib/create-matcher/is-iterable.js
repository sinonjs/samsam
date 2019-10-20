"use strict";

var type = require("type-detect");

/**
 * Returns `true` for iterables
 *
 * @private
 * @param {*} value A value to examine
 * @returns {boolean} Returns `true` when `value` looks like an iterable
 */
function isIterable(value) {
    return Boolean(value) && type(value.forEach) === "function";
}

module.exports = isIterable;
