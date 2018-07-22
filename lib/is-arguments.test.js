"use strict";

var assert = require("@sinonjs/referee").assert;
var samsam = require("./samsam");

describe("isArguments", function () {
    it("returns true if arguments is an object", function () {
        var checkArgs = samsam.isArguments(arguments);
        assert.isTrue(checkArgs);
    });

    it("returns false if number", function () {
        var checkArgs = samsam.isArguments(24);
        assert.isFalse(checkArgs);
    });

    it("returns false if empty object", function () {
        var checkArgs = samsam.isArguments({});
        assert.isFalse(checkArgs);
    });

    it("returns true if arguments object from strict-mode function", function () {
        var returnArgs = function () {
            return arguments;
        };
        var checkArgs = samsam.isArguments(returnArgs());
        assert.isTrue(checkArgs);
    });
});
