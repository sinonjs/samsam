"use strict";

const forEach = require("@sinonjs/commons").prototypes.set.forEach;

/**
 * Returns `true` when `s1` is a subset of `s2`, `false` otherwise
 *
 * @private
 * @param  {Array|Set}  s1      The target value
 * @param  {Array|Set}  s2      The containing value
 * @param  {Function}  compare A comparison function, should return `true` when
 *                             values are considered equal
 * @returns {boolean} Returns `true` when `s1` is a subset of `s2`, `false`` otherwise
 */
function isSubset(s1, s2, compare) {
    let allContained = true;
    forEach(s1, (v1) => {
        let includes = false;
        forEach(s2, (v2) => {
            if (compare(v2, v1)) {
                includes = true;
            }
        });
        allContained &&= includes;
    });

    return allContained;
}

module.exports = isSubset;
