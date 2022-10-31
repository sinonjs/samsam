"use strict";

var jQuery = require("jquery");
var assert = require("@sinonjs/referee").assert;
var refute = require("@sinonjs/referee").refute;

var samsam = require("./samsam");

describe("issues", function () {
    describe("issue #71", function () {
        before(function () {
            if (typeof window === "undefined") {
                this.skip();
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
                jQuery(`
                    <body>
                        <p id='test1'>My <em>old</em> text</p>
                        <p id='test2'>My <em>new</em> text</p>
                    </body>
                `).appendTo("html");

                assert.isFalse(
                    samsam.deepEqual(jQuery("#test1"), jQuery("#test2"))
                );
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
