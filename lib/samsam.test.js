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

describe("isArguments", function () {
    it("Should pass if arguments is an object", function () {
        var checkArgs = samsam.isArguments(arguments);
        assert.equals(checkArgs, true);
    });

    it("Should fail if number", function () {
        var checkArgs = samsam.isArguments(24);
        refute.equals(checkArgs, true);
    });

    it("Should fail if empty object", function () {
        var checkArgs = samsam.isArguments({});
        refute.equals(checkArgs, true);
    });

    it("Should pass if arguments object from strict-mode function", function () {
        var returnArgs = function () {
            return arguments;
        };
        var checkArgs = samsam.isArguments(returnArgs());
        assert.equals(checkArgs, true);
    });
});

describe("isNegZero", function () {
    it("Should pass if negative zero", function () {
        var checkZero = samsam.isNegZero(-0);
        assert.equals(checkZero, true);
    });

    it("Should fail if zero", function () {
        var checkZero = samsam.isNegZero(0);
        refute.equals(checkZero, true);
    });

    it("Should fail if object", function () {
        var checkZero = samsam.isNegZero({});
        refute.equals(checkZero, true);
    });

    it("Should fail if String", function () {
        var checkZero = samsam.isNegZero("-0");
        refute.equals(checkZero, true);
    });
});

describe("identical", function () {
    it("Should pass if strings are identical", function () {
        var str = "string";
        var checkIdent = samsam.identical(str, str);
        assert.equals(checkIdent, true);
    });

    it("Should pass if objects are identical", function () {
        var obj = { id: 42 };
        var checkIdent = samsam.identical(obj, obj);
        assert.equals(checkIdent, true);
    });

    it("Should pass if NaN", function () {
        var checkIdent = samsam.identical(NaN, NaN);
        assert.equals(checkIdent, true);
    });

    it("Should fail if equal but different type", function () {
        var checkIdent = samsam.identical(0, "0");
        refute.equals(checkIdent, true);
    });

    it("Should fail on -0 and 0", function () {
        var checkIdent = samsam.identical(0, -0);
        refute.equals(checkIdent, true);
    });
});

describe("deepEqual", function () {
    it("Should pass if equal cyclic objects (cycle on 2nd level)", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = cyclic1;
        cyclic2.ref = cyclic2;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        assert.equals(checkDeep, true);
    });

    it("Should fail if different cyclic objects (cycle on 2nd level)", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = cyclic1;
        cyclic2.ref = cyclic2;
        cyclic2.ref2 = cyclic2;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        refute.equals(checkDeep, true);
    });

    it("Should pass if equal cyclic objects (cycle on 3rd level)", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = {};
        cyclic1.ref.ref = cyclic1;
        cyclic2.ref = {};
        cyclic2.ref.ref = cyclic2;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        assert.equals(checkDeep, true);
    });

    it("Should fail if different cyclic objects (cycle on 3rd level)", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = {};
        cyclic1.ref.ref = cyclic1;
        cyclic2.ref = {};
        cyclic2.ref.ref = cyclic2;
        cyclic2.ref.ref2 = cyclic2;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        refute.equals(checkDeep, true);
    });

    it("Should pass if equal objects even though only one object is cyclic", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = cyclic1;
        cyclic2.ref = cyclic1;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        assert.equals(checkDeep, true);
    });

    it("Should pass if referencing different but equal cyclic objects", function () {
        var cyclic1 = {};
        var cyclic2 = {};
        cyclic1.ref = {
            ref: cyclic1
        };
        cyclic2.ref = {};
        cyclic2.ref.ref = cyclic2.ref;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        assert.equals(checkDeep, true);
    });

    it("Should fail if referencing different and unequal cyclic objects", function () {
        var cyclic1 = {a: "a"};
        var cyclic2 = {a: "a"};
        cyclic1.ref = {
            b: "b",
            ref: cyclic1
        };
        cyclic2.ref = {
            b: "b"
        };
        cyclic2.ref.ref = cyclic2.ref;
        var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
        refute.equals(checkDeep, true);
    });
});
