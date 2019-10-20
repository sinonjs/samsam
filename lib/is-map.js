"use strict";

var type = require("type-detect");

/**
 * Returns `true` when `value` is a Map
 *
 * @param {*} value A value to examine
 * @returns {boolean} `true` when `value` is an instance of `Map`, `false` otherwise
 * @private
 */
function isMap(value) {
    return type(value) === "Map";
}

module.exports = isMap;
