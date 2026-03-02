"use strict";

var assert = require("@sinonjs/referee").assert;
var refute = require("@sinonjs/referee").refute;
var deleteRequireCache = require("./delete-require-cache");

var samsam = require("./samsam");

describe("issues", function () {
    describe("issue #71", function () {
        var jQuery;

        before(function () {
            if (typeof window === "undefined") {
                this.jsdom = require("jsdom-global")();
            }

            deleteRequireCache(require, "jquery");
            jQuery = require("jquery");
        });

        after(function () {
            jQuery = undefined;
            if (this.jsdom) {
                this.jsdom();
            }
        });

        context("when comparing jQuery objects", function () {
            it("should not throw", function () {
                refute.exception(function () {
                    samsam.deepEqual(jQuery("body"), jQuery("body"));
                });
            });
        });

        context("when comparing different jQuery objects", function () {
            it("should return false", function () {
                var first = jQuery("<p id='test1'>My <em>old</em> text</p>");
                var second = jQuery("<p id='test2'>My <em>new</em> text</p>");

                assert.isFalse(samsam.deepEqual(first, second));
            });
        });

        context("when comparing the same jQuery object", function () {
            it("should return true", function () {
                var $head = jQuery("head");

                assert.isTrue(samsam.deepEqual($head, $head));
            });
        });
    });
});
