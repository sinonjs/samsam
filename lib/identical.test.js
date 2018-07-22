"use strict";

var assert = require("@sinonjs/referee").assert;
var samsam = require("./samsam");

describe("identical", function () {
    it("returns true if strings are identical", function () {
        var str = "string";
        var checkIdent = samsam.identical(str, str);
        assert.isTrue(checkIdent);
    });

    it("returns true if objects are identical", function () {
        var obj = { id: 42 };
        var checkIdent = samsam.identical(obj, obj);
        assert.isTrue(checkIdent);
    });

    it("returns true if NaN", function () {
        var checkIdent = samsam.identical(NaN, NaN);
        assert.isTrue(checkIdent);
    });

    it("returns false if equal but different type", function () {
        var checkIdent = samsam.identical(0, "0");
        assert.isFalse(checkIdent);
    });

    it("returns false on -0 and 0", function () {
        var checkIdent = samsam.identical(0, -0);
        assert.isFalse(checkIdent);
    });
});
