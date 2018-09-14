"use strict";

var assert = require("@sinonjs/referee").assert;
var getClassName = require("./get-class-name");

describe("getClassName", function() {
    it("returns the class name of an instance", function() {
        // Because eslint-config-sinon disables es6, we can't
        // use a class definition here
        // https://github.com/sinonjs/eslint-config-sinon/blob/master/index.js
        // var instance = new (class TestClass {})();
        var instance = new function TestClass() {}();
        var name = getClassName(instance);
        assert.equals(name, "TestClass");
    });

    it("returns 'Object' for {}", function() {
        var name = getClassName({});
        assert.equals(name, "Object");
    });

    it("returns null for an object that has no prototype", function() {
        var obj = Object.create(null);
        var name = getClassName(obj);
        assert.equals(name, null);
    });

    it("returns null for an object whose prototype was mangled", function() {
        // This is what Node v6 and v7 do for objects returned by querystring.parse()
        function MangledObject() {}
        MangledObject.prototype = Object.create(null);
        var obj = new MangledObject();
        var name = getClassName(obj);
        assert.equals(name, null);
    });
});
