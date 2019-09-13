"use strict";

var getClass = require("./get-class");

/**
 * Returns `true` when `object` is an `arguments` object, `false` otherwise
 *
 * @alias module:samsam.isArguments
 * @param  {*}  object - The object to examine
 * @returns {boolean} `true` when `object` is an `arguments` object
 */
function isArguments(object) {
    if (getClass(object) === "Arguments") {
        return true;
    }
    if (
        typeof object !== "object" ||
        typeof object.length !== "number" ||
        getClass(object) === "Array"
    ) {
        return false;
    }
    if (typeof object.callee === "function") {
        return true;
    }

    return false;
}

module.exports = isArguments;
