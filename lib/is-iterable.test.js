"use strict";

var assert = require("@sinonjs/referee").assert;
var isIterable = require("./is-iterable");

describe("isIterable", function () {
    it("returns false if not object", function () {
        assert.isFalse(isIterable(undefined));
    });

    it("returns false if object does not have iterator function", function () {
        assert.isFalse(isIterable({}));
    });

    it("returns true if Set", function () {
        assert.isTrue(isIterable(new Set()));
    });

    it("returns true if Set iterator", function () {
        assert.isTrue(isIterable(new Set().values()));
    });

    it("returns true if Map", function () {
        assert.isTrue(isIterable(new Map()));
    });

    it("returns true if Map iterator", function () {
        assert.isTrue(isIterable(new Map().values()));
    });
});
