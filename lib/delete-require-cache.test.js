"use strict";

var assert = require("@sinonjs/referee").assert;
var refute = require("@sinonjs/referee").refute;

var deleteRequireCache = require("./delete-require-cache");

describe("deleteRequireCache", function () {
    it("returns false when require.resolve is unavailable", function () {
        function requireLike() {
            return null;
        }

        refute.exception(function () {
            assert.isFalse(deleteRequireCache(requireLike, "./module"));
        });
    });

    it("returns false when require.cache is unavailable", function () {
        function requireLike() {
            return null;
        }

        requireLike.resolve = function () {
            return "./module";
        };

        refute.exception(function () {
            assert.isFalse(deleteRequireCache(requireLike, "./module"));
        });
    });

    it("deletes the resolved entry from the cache", function () {
        function requireLike() {
            return null;
        }

        requireLike.cache = {
            "/tmp/module.js": {
                exports: {},
            },
        };
        requireLike.resolve = function (moduleId) {
            assert.equals(moduleId, "./module");
            return "/tmp/module.js";
        };

        assert.isTrue(deleteRequireCache(requireLike, "./module"));
        assert.isUndefined(requireLike.cache["/tmp/module.js"]);
    });
});
