"use strict";

var functionName = require("@sinonjs/commons").functionName;

function getClassName(value) {
    if (value.constructor && "name" in value.constructor) {
        return value.constructor.name;
    }

    if (typeof value.constructor === "function") {
        var name = functionName(value.constructor);

        if (name) {
            return name;
        }
    }

    return null;
}

module.exports = getClassName;
