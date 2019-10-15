"use strict";

var assert = require("@sinonjs/referee").assert;

var samsam = require("./samsam");

var engineSupportsFunctionNameProperty = (function detectFunctionNameSupport() {
    return (
        typeof detectFunctionNameSupport.name === "string" &&
        detectFunctionNameSupport.name === "detectFunctionNameSupport"
    );
})();

describe("samsam API", function() {
    before(function() {
        if (!engineSupportsFunctionNameProperty) {
            this.skip();
        }
    });

    it("should have a binary method named `createMatcher`", function() {
        assert.equals(samsam.createMatcher.name, "createMatcher");
        assert.hasArity(samsam.createMatcher, 2);
    });

    it("should have a binary method named `deepEqual`", function() {
        assert.equals(samsam.deepEqual.name, "deepEqual");
        assert.hasArity(samsam.deepEqual, 2);
    });

    it("should have a binary method named `identical`", function() {
        assert.equals(samsam.identical.name, "identical");
        assert.hasArity(samsam.identical, 2);
    });

    it("should have a unary method named `isArguments`", function() {
        assert.equals(samsam.isArguments.name, "isArguments");
        assert.hasArity(samsam.isArguments, 1);
    });

    it("should have a unary method named `isElement`", function() {
        assert.equals(samsam.isElement.name, "isElement");
        assert.hasArity(samsam.isElement, 1);
    });

    it("should have a unary method named `isMap`", function() {
        assert.equals(samsam.isMap.name, "isMap");
        assert.hasArity(samsam.isMap, 1);
    });

    it("should have a unary method named `isNegZero`", function() {
        assert.equals(samsam.isNegZero.name, "isNegZero");
        assert.hasArity(samsam.isNegZero, 1);
    });

    it("should have a unary method named `isSet`", function() {
        assert.equals(samsam.isSet.name, "isSet");
        assert.hasArity(samsam.isSet, 1);
    });

    it("should have a binary method named `match`", function() {
        assert.equals(samsam.match.name, "match");
        assert.hasArity(samsam.match, 2);
    });
});
