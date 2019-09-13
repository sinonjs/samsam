"use strict";

var assert = require("@sinonjs/referee").assert;
var proxyquire = require("proxyquire")
    .noCallThru()
    .noPreserveCache();

describe("isArguments", function() {
    [true, false].forEach(function(value) {
        context("when engineCanDetectArguments returns " + value, function() {
            var isArguments;

            beforeEach(function() {
                isArguments = proxyquire("./is-arguments", {
                    "./engine-can-detect-arguments": value
                });
            });

            it("returns true if arguments", function() {
                var checkArgs = isArguments(arguments);

                assert.isTrue(checkArgs);
            });

            it("returns false if number", function() {
                var checkArgs = isArguments(24);
                assert.isFalse(checkArgs);
            });

            it("returns false if empty object", function() {
                var checkArgs = isArguments({});
                assert.isFalse(checkArgs);
            });

            it("returns true if arguments object from strict-mode function", function() {
                var returnArgs = function() {
                    return arguments;
                };
                var checkArgs = isArguments(returnArgs());
                assert.isTrue(checkArgs);
            });
        });
    });
});
