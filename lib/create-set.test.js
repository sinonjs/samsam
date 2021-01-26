"use strict";

var assert = require("@sinonjs/referee").assert;
var createSet = require("./create-set");

describe("createSet", function () {
    describe("when called without arguments", function () {
        it("returns an empty Set", function () {
            var set = createSet();

            assert.isSet(set);
            assert.equals(set.size, 0);
        });
    });

    describe("when called with a non-empty Array", function () {
        it("returns a Set with the same (distinct) members", function () {
            var array = [0, 1, 1, 1, 1, 2, 3, 4];
            var set = createSet(array);

            set.forEach(function (value) {
                assert.isTrue(array.indexOf(value) !== -1);
            });
        });
    });

    describe("when called with non-Array or empty Array argument", function () {
        it("throws a TypeError", function () {
            var invalids = [
                {},
                new Date(),
                new Set(),
                new Map(),
                null,
                undefined,
            ];

            invalids.forEach(function (value) {
                assert.exception(function () {
                    createSet(value);
                }, /createSet can be called with either no arguments or an Array/);
            });
        });
    });
});
