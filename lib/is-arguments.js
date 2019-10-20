"use strict";

var type = require("type-detect");

/**
 * Returns `true` when `object` is an `arguments` object, `false` otherwise
 *
 * @alias module:samsam.isArguments
 * @param  {*}  object - The object to examine
 * @returns {boolean} `true` when `object` is an `arguments` object
 */
function isArguments(object) {
    return type(object) === "Arguments";
}

module.exports = isArguments;
