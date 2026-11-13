"use strict";

const isPrototypeOf =
    require("@sinonjs/commons").prototypes.object.isPrototypeOf;

const matcherPrototype = require("./matcher-prototype");

/**
 * Returns `true` when `object` is a matcher
 *
 * @private
 * @param {unknown} object A value to examine
 * @returns {boolean} Returns `true` when `object` is a matcher
 */
function isMatcher(object) {
    return isPrototypeOf(matcherPrototype, object);
}

module.exports = isMatcher;
