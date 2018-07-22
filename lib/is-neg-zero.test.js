"use strict";

var assert = require("@sinonjs/referee").assert;
var samsam = require("./samsam");

describe("isNegZero", function () {
    it("returns true if negative zero", function () {
        var checkZero = samsam.isNegZero(-0);
        assert.isTrue(checkZero);
    });

    it("returns false if zero", function () {
        var checkZero = samsam.isNegZero(0);
        assert.isFalse(checkZero);
    });

    it("returns false if object", function () {
        var checkZero = samsam.isNegZero({});
        assert.isFalse(checkZero);
    });

    it("returns false if String", function () {
        var checkZero = samsam.isNegZero("-0");
        assert.isFalse(checkZero);
    });
});
