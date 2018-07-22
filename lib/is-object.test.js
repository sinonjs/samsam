"use strict";

var assert = require("@sinonjs/referee").assert;
var isObject = require("./is-object");

describe("isObject", function() {
    it("returns true for plain instances", function() {
        assert.isTrue(isObject({}));
        assert.isTrue(isObject(Object.create(null)));
    });

    it("returns false for Boolean instances", function() {
        // eslint-disable-next-line no-new-wrappers
        assert.isFalse(isObject(new Boolean(true)));
        // eslint-disable-next-line no-new-wrappers
        assert.isFalse(isObject(new Boolean(false)));
    });

    it("returns false for Date instances", function() {
        assert.isFalse(isObject(new Date()));
    });

    it("returns false for Error instances", function() {
        assert.isFalse(isObject(new Error()));
        assert.isFalse(isObject(new EvalError()));
        assert.isFalse(isObject(new RangeError()));
        assert.isFalse(isObject(new ReferenceError()));
        assert.isFalse(isObject(new SyntaxError()));
        assert.isFalse(isObject(new TypeError()));
        assert.isFalse(isObject(new URIError()));
    });

    it("returns false for Number instances", function() {
        // eslint-disable-next-line no-new-wrappers
        assert.isFalse(isObject(new Number()));
    });

    it("returns false for RegExp instances", function() {
        assert.isFalse(isObject(new RegExp()));
    });

    it("returns false for String instances", function() {
        // eslint-disable-next-line no-new-wrappers
        assert.isFalse(isObject(new String()));
    });
});
