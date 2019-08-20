"use strict";

var forEach = require("@sinonjs/commons").prototypes.set.forEach;

function isSubset(s1, s2, compare) {
    var allContained = true;
    forEach(s1, function(v1) {
        var includes = false;
        forEach(s2, function(v2) {
            if (compare(v2, v1)) {
                includes = true;
            }
        });
        allContained = allContained && includes;
    });

    return allContained;
}

module.exports = isSubset;
