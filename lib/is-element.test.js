"use strict";

var assert = require("@sinonjs/referee").assert;
require("jsdom-global")();
var samsam = require("./samsam");

describe("isElement", function() {
    it("returns true if DOM element node", function() {
        var element = document.createElement("div");
        var checkElement = samsam.isElement(element);
        assert.isTrue(checkElement);
    });

    it("returns false if DOM text node", function() {
        var element = document.createTextNode("Hello");
        var checkElement = samsam.isElement(element);
        assert.isFalse(checkElement);
    });

    it("returns false if node like object", function() {
        var nodeLike = { nodeType: 1 };
        var checkElement = samsam.isElement(nodeLike);
        assert.isFalse(checkElement);
    });

    it("returns false if number", function() {
        var checkElement = samsam.isElement(42);
        assert.isFalse(checkElement);
    });

    it("returns false if object", function() {
        var checkElement = samsam.isElement({});
        assert.isFalse(checkElement);
    });
});
