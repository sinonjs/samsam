"use strict";

const functionName = require("@sinonjs/commons").functionName;
const indexOf = require("@sinonjs/commons").prototypes.array.indexOf;
const map = require("@sinonjs/commons").prototypes.array.map;
const ARRAY_TYPES = require("./array-types");
const type = require("type-detect");

/**
 * Returns `true` when `object` is an array type, `false` otherwise
 *
 * @param  {*}  object - The object to examine
 * @returns {boolean} `true` when `object` is an array type
 * @private
 */
function isArrayType(object) {
    return indexOf(map(ARRAY_TYPES, functionName), type(object)) !== -1;
}

module.exports = isArrayType;
