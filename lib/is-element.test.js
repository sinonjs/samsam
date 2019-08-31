"use strict";

var assert = require("@sinonjs/referee").assert;

// in order for `is-element.js` to correctly detect the DOM being set up
// in the previous line, we need to reload it, as other tests will have
// loaded `is-element.js`, most likely without a DOM in place
function requireWithDOM(file) {
    require("jsdom-global")();

    delete require.cache[require.resolve(file)];

    return require("./is-element");
}

describe("isElement", function() {
    var isElement;

    before(function() {
        isElement = requireWithDOM("./is-element");
    });

    it("returns true if DOM element node", function() {
        var element = document.createElement("div");
        var checkElement = isElement(element);
        assert.isTrue(checkElement);
    });

    it("returns false if DOM text node", function() {
        var element = document.createTextNode("Hello");
        var checkElement = isElement(element);
        assert.isFalse(checkElement);
    });

    it("returns false if node like object", function() {
        var nodeLike = { nodeType: 1 };
        var checkElement = isElement(nodeLike);
        assert.isFalse(checkElement);
    });

    it("returns false if number", function() {
        var checkElement = isElement(42);
        assert.isFalse(checkElement);
    });

    it("returns false if object", function() {
        var checkElement = isElement({});
        assert.isFalse(checkElement);
    });
});
