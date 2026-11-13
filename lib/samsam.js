"use strict";

/**
 * @module samsam
 */
const identical = require("./identical");
const isArguments = require("./is-arguments");
const isElement = require("./is-element");
const isNegZero = require("./is-neg-zero");
const isSet = require("./is-set");
const isMap = require("./is-map");
const match = require("./match");
const deepEqualCyclic = require("./deep-equal").use(match);
const createMatcher = require("./create-matcher");

module.exports = {
    createMatcher,
    deepEqual: deepEqualCyclic,
    identical,
    isArguments,
    isElement,
    isMap,
    isNegZero,
    isSet,
    match,
};
