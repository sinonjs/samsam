"use strict";

var type = require("type-detect");

/**
 * Returns `true` when the argument is an instance of Set, `false` otherwise
 *
 * @alias module:samsam.isSet
 * @param  {*}  value - A value to examine
 * @returns {boolean} Returns `true` when the argument is an instance of Set, `false` otherwise
 */
function isSet(value) {
    return type(value) === "Set";
}

module.exports = isSet;
