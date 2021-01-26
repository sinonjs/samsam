"use strict";

var assert = require("@sinonjs/referee").assert;
var forEach = require("@sinonjs/commons").prototypes.array.forEach;
var functionName = require("@sinonjs/commons").functionName;

var ARRAY_TYPES = require("./array-types");
var isArrayType = require("./is-array-type");

describe("isArrayType", function () {
    forEach(ARRAY_TYPES, function (ArrayType) {
        context("given " + functionName(ArrayType), function () {
            it("returns true", function () {
                assert.isTrue(isArrayType(new ArrayType([])));
            });
        });
    });

    context("given other types", function () {
        it("returns false", function () {
            assert.isFalse(isArrayType(null));
            assert.isFalse(isArrayType("string"));
            assert.isFalse(isArrayType(42));
            assert.isFalse(isArrayType({}));
            assert.isFalse(isArrayType(/sinon/));
        });
    });
});
