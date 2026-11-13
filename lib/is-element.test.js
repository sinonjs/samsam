"use strict";

const assert = require("@sinonjs/referee").assert;
const deleteRequireCache = require("./delete-require-cache");

describe("isElement", function () {
    let isElement;

    before(function () {
        if (typeof document === "undefined") {
            this.jsdom = require("jsdom-global")();
            // in order for `is-element.js` to correctly detect the DOM being set up
            // in the previous line, we need to reload it, as other tests will have
            // loaded `is-element.js`, most likely without a DOM in place
            deleteRequireCache(require, "./is-element");
        }
        isElement = require("./is-element");
    });

    after(function () {
        if (this.jsdom) {
            this.jsdom();
        }
    });

    context("when called with a DOM element node", function () {
        it("returns true", function () {
            const element = document.createElement("div");
            const result = isElement(element);

            assert.isTrue(result);
        });
    });

    context("when called with a DOM text node", function () {
        it("returns false", function () {
            const element = document.createTextNode("Hello");
            const result = isElement(element);

            assert.isFalse(result);
        });
    });

    context("when called with a node like object", function () {
        it("returns false", function () {
            const nodeLike = { nodeType: 1 };
            const result = isElement(nodeLike);

            assert.isFalse(result);
        });
    });

    context("when called with a number", function () {
        it("returns false", function () {
            const result = isElement(42);

            assert.isFalse(result);
        });
    });

    context("when called with an object", function () {
        it("returns false", function () {
            const result = isElement({});

            assert.isFalse(result);
        });
    });
});
