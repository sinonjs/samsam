"use strict";

var getClass = require("./get-class");

/**
 * Returns `true` when `object` is an `arguments` object, `false` otherwise.
 * @param  {*}  object - The object to examine
 * @return {Boolean}
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
    try {
        object[object.length] = 6;
        delete object[object.length];
    } catch (e) {
        return true;
    }
    return false;
}

module.exports = isArguments;
