"use strict";

var assert = require("@sinonjs/referee").assert;
var samsam = require("./samsam");
var match = samsam.match;

describe("sinon-match-integration", function() {
    context("samsam.match", function() {
        context("returns true", function() {
            it("if matching custom matcher", function() {
                var matchAlways = samsam.createMatcher(function() {
                    return true;
                });
                assert.isTrue(match(42, matchAlways));
            });

            it("if matching boolean", function() {
                assert.isTrue(samsam.match(false, match.bool));
            });

            it("if matching number", function() {
                assert.isTrue(samsam.match(42, match.number));
            });

            it("if matching string", function() {
                assert.isTrue(samsam.match("abc", match.string));
            });

            it("when matching nested matcher", function() {
                assert.isTrue(samsam.match({ x: 1 }, { x: match.number }));
            });
        });

        context("returns false", function() {
            it("if not matching custom matcher", function() {
                var matchAlways = samsam.createMatcher(function() {
                    return false;
                });
                assert.isFalse(match(42, matchAlways));
            });

            it("if not matching boolean", function() {
                assert.isFalse(samsam.match(0, match.bool));
            });

            it("if not matching number", function() {
                assert.isFalse(samsam.match("42", match.number));
            });

            it("if not matching string", function() {
                assert.isFalse(samsam.match(123, match.string));
            });

            it("when not matching nested matcher", function() {
                assert.isFalse(samsam.match({ x: 1 }, { x: match.string }));
            });
        });
    });

    context("samsam.deepEqual", function() {
        context("returns true", function() {
            it("if matching boolean", function() {
                assert.isTrue(samsam.deepEqual(false, match.bool));
            });

            it("when matching nested matcher", function() {
                assert.isTrue(samsam.deepEqual({ x: 1 }, { x: match.number }));
            });
        });

        context("returns false", function() {
            it("when not matching nested matcher", function() {
                assert.isFalse(samsam.deepEqual({ x: 1 }, { x: match.string }));
            });
        });
    });
});
