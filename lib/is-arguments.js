"use strict";

var getClass = require("./get-class");
var engineCanDetectArguments = require("./engine-can-detect-arguments");

/**
 * Returns `true` when `object` is an `arguments` object, `false` otherwise
 *
 * @alias module:samsam.isArguments
 * @param  {*}  object - The object to examine
 * @returns {boolean} `true` when `object` is an `arguments` object
 */
function isArguments(object) {
    return engineCanDetectArguments
        ? isArgumentsFromClass(object)
        : isArgumentsFromCallee(object);
}

// eslint-disable-next-line jsdoc/require-jsdoc
function isArgumentsFromClass(object) {
    return getClass(object) === "Arguments";
}

// eslint-disable-next-line jsdoc/require-jsdoc
function isArgumentsFromCallee(value) {
    return typeof value === "object" && "callee" in value;
}
module.exports = isArguments;
