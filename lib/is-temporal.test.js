"use strict";

var assert = require("@sinonjs/referee").assert;
var isTemporal = require("./is-temporal");

describe("isTemporal", function () {
    it("returns true for an object tagged as a Temporal type", function () {
        var instant = {};
        instant[Symbol.toStringTag] = "Temporal.Instant";

        assert.isTrue(isTemporal(instant));
    });

    it("returns false for other objects", function () {
        assert.isFalse(isTemporal({}));
        assert.isFalse(isTemporal(new Date()));
        assert.isFalse(isTemporal(null));
    });
});
