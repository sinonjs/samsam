"use strict";

const assert = require("@sinonjs/referee").assert;

const isArguments = require("./is-arguments");

describe("isArguments", function () {
    it("returns true if arguments", function () {
        const actual = isArguments(arguments);

        assert.isTrue(actual);
    });

    it("returns false if number", function () {
        const actual = isArguments(24);

        assert.isFalse(actual);
    });

    it("returns false if empty object", function () {
        const actual = isArguments({});

        assert.isFalse(actual);
    });

    it("returns false if arguments is an array", function () {
        const actual = isArguments([]);

        assert.isFalse(actual);
    });

    it("returns false if string", function () {
        const actual = isArguments("");

        assert.isFalse(actual);
    });

    it("returns true if arguments object from strict-mode function", function () {
        const returnArgs = function () {
            return arguments;
        };
        const actual = isArguments(returnArgs());

        assert.isTrue(actual);
    });
});
