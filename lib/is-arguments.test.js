"use strict";

var assert = require("@sinonjs/referee").assert;

var isArguments = require("./is-arguments");

describe("isArguments", function() {
    it("returns true if arguments", function() {
        var actual = isArguments(arguments);

        assert.isTrue(actual);
    });

    it("returns false if number", function() {
        var actual = isArguments(24);

        assert.isFalse(actual);
    });

    it("returns false if empty object", function() {
        var actual = isArguments({});

        assert.isFalse(actual);
    });

    it("returns false if arguments is an array", function() {
        var actual = isArguments([]);

        assert.isFalse(actual);
    });

    it("returns false if string", function() {
        var actual = isArguments("");

        assert.isFalse(actual);
    });

    it("returns true if arguments object from strict-mode function", function() {
        var returnArgs = function() {
            return arguments;
        };
        var actual = isArguments(returnArgs());

        assert.isTrue(actual);
    });
});
