"use strict";

var referee = require("referee");
var assert = referee.assert;
var refute = referee.refute;

describe("SamSam", function () {
    it("Should Always Be true", function () {
        assert.equals(42, 42);
    });

    it("Should Always Be False", function () {
        refute.equals(42, 12);
    });
});
