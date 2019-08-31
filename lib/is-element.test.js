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
        var result = isElement(element);

        assert.isTrue(result);
    });

    it("returns false if DOM text node", function() {
        var element = document.createTextNode("Hello");
        var result = isElement(element);

        assert.isFalse(result);
    });

    it("returns false if node like object", function() {
        var nodeLike = { nodeType: 1 };
        var result = isElement(nodeLike);

        assert.isFalse(result);
    });

    it("returns false if number", function() {
        var result = isElement(42);

        assert.isFalse(result);
    });

    it("returns false if object", function() {
        var result = isElement({});

        assert.isFalse(result);
    });
});
