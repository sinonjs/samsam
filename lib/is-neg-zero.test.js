"use strict";

const assert = require("@sinonjs/referee").assert;
const samsam = require("./samsam");

describe("isNegZero", function () {
    it("returns true if negative zero", function () {
        const checkZero = samsam.isNegZero(-0);
        assert.isTrue(checkZero);
    });

    it("returns false if zero", function () {
        const checkZero = samsam.isNegZero(0);
        assert.isFalse(checkZero);
    });

    it("returns false if object", function () {
        const checkZero = samsam.isNegZero({});
        assert.isFalse(checkZero);
    });

    it("returns false if String", function () {
        const checkZero = samsam.isNegZero("-0");
        assert.isFalse(checkZero);
    });
});
