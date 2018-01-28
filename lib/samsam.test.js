"use strict";

var referee = require("@sinonjs/referee");
var assert = referee.assert;
var refute = referee.refute;

var samsam = require("./samsam");

describe("isElement", function () {
    it("Should pass if DOM element node", function () {
        if (typeof document !== "undefined") {
            var element = document.createElement("div");
            var checkElement = samsam.isElement(element);
            assert.equals(checkElement, true);
        }
    });

    it("Should fail if DOM text node", function () {
        if (typeof document !== "undefined") {
            var element = document.createTextNode("Hello");
            var checkElement = samsam.isElement(element);
            refute.equals(checkElement, true);
        }
    });

    it("Should fail if node like object", function () {
        var nodeLike = { nodeType: 1 };
        var checkElement = samsam.isElement(nodeLike);
        refute.equals(checkElement, true);
    });

    it("Should fail if number", function () {
        var checkElement = samsam.isElement(42);
        refute.equals(checkElement, true);
    });

    it("Should fail if object", function () {
        var checkElement = samsam.isElement({});
        refute.equals(checkElement, true);
    });
});
