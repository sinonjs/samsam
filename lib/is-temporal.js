"use strict";

var getClass = require("./get-class");

/**
 * Returns `true` when `value` is a Temporal object, e.g. a `Temporal.Instant`
 *
 * Temporal objects keep their data in internal slots, so they have no
 * enumerable properties to compare.
 *
 * @private
 * @param  {*}  value The value to examine
 * @returns {boolean} `true` when `value` is a Temporal object
 */
function isTemporal(value) {
    return getClass(value).indexOf("Temporal.") === 0;
}

module.exports = isTemporal;
