"use strict";

var referee = require("@sinonjs/referee");
var assert = referee.assert;
var refute = referee.refute;
require("jsdom-global")();
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
    var func = function () {};
    var obj = {};
    var arr = [];
    var date = new Date();
    var sameDate = new Date(date.getTime());
    var sameDateWithProp = new Date(date.getTime());
    sameDateWithProp.prop = 42;

    it("Should pass if object to itself", function () {
        var checkDeep = samsam.deepEqual(obj, obj);
        assert.equals(checkDeep, true);
    });

    it("Should pass if strings", function () {
        var checkDeep = samsam.deepEqual("string", "string");
        assert.equals(checkDeep, true);
    });

    it("Should pass if numbers", function () {
        var checkDeep = samsam.deepEqual(32, 32);
        assert.equals(checkDeep, true);
    });

    it("Should pass if boolean", function () {
        var checkDeep = samsam.deepEqual(false, false);
        assert.equals(checkDeep, true);
    });

    it("Should pass if null", function () {
        var checkDeep = samsam.deepEqual(null, null);
        assert.equals(checkDeep, true);
    });

    it("Should pass if undefined", function () {
        var checkDeep = samsam.deepEqual(undefined, undefined);
        assert.equals(checkDeep, true);
    });

    it("Should pass if function to itself", function () {
        var checkDeep = samsam.deepEqual(func, func);
        assert.equals(checkDeep, true);
    });

    it("Should fail if different functions", function () {
        var checkDeep = samsam.deepEqual(function () {}, function () {});
        refute.equals(checkDeep, true);
    });

    it("Should pass if array to itself", function () {
        var checkDeep = samsam.deepEqual(arr, arr);
        assert.equals(checkDeep, true);
    });

    it("Should pass if date objects with same date", function () {
        var checkDeep = samsam.deepEqual(date, sameDate);
        assert.equals(checkDeep, true);
    });

    it("Should fail if date objects with different dates", function () {
        var checkDeep = samsam.deepEqual(date, sameDateWithProp);
        refute.equals(checkDeep, true);
    });

    it("Should fail if strings and numbers with coercion", function () {
        var checkDeep = samsam.deepEqual("4", 4);
        refute.equals(checkDeep, true);
    });

    it("Should fail if numbers and strings with coercion", function () {
        var checkDeep = samsam.deepEqual(4, "4");
        refute.equals(checkDeep, true);
    });

    it("Should fail if number object with coercion", function () {
        var checkDeep = samsam.deepEqual(32, new Number(32)); // eslint-disable-line
        refute.equals(checkDeep, true);
    });

    it("Should fail if number object reverse with coercion", function () {
        var checkDeep = samsam.deepEqual(new Number(32), 32); // eslint-disable-line
        refute.equals(checkDeep, true);
    });

    it("Should fail if falsy values with coercion", function () {
        var checkDeep = samsam.deepEqual(0, "");
        refute.equals(checkDeep, true);
    });

    it("Should fail if falsy values reverse with coercion", function () {
        var checkDeep = samsam.deepEqual("", 0);
        refute.equals(checkDeep, true);
    });

    it("Should fail if string boxing with coercion", function () {
        var checkDeep = samsam.deepEqual("4", new String("4")); //eslint-disable-line
        refute.equals(checkDeep, true);
    });

    it("Should fail if string boxing reverse with coercion", function () {
        var checkDeep = samsam.deepEqual(new String("4"), "4"); //eslint-disable-line
        refute.equals(checkDeep, true);
    });

    it("Should pass if NaN to Nan", function () {
        var checkDeep = samsam.deepEqual(NaN, NaN);
        assert.equals(checkDeep, true);
    });

    it("Should fail if -0 to +0", function () {
        var checkDeep = samsam.deepEqual(+0, -0);
        refute.equals(checkDeep, true);
    });

    it("Should fail if -0 to 0", function () {
        var checkDeep = samsam.deepEqual(-0, 0);
        refute.equals(checkDeep, true);
    });

    it("Should fail if objects with different own properties", function () {
        var checkDeep = samsam.deepEqual({ id: 42 }, { id: 42, di: 24 });
        refute.equals(checkDeep, true);
    });

    it("Should fail if objects with different own properties values", function () {
        var checkDeep = samsam.deepEqual({ id: 42 }, { id: undefined });
        refute.equals(checkDeep, true);
    });

    it("Should fail if objects with one property with different values", function () {
        var checkDeep = samsam.deepEqual({ id: 42 }, { id: 24 });
        refute.equals(checkDeep, true);
    });

    it("Should pass if complex objects", function () {
        var deepObject = {
            id: 42,
            name: "Hey",
            sayIt: function () {
                return this.name;
            },

            child: {
                speaking: function () {}
            }
        };
        var checkDeep = samsam.deepEqual(deepObject, {
            sayIt: deepObject.sayIt,
            child: { speaking: deepObject.child.speaking },
            id: 42,
            name: "Hey"
        });
        assert.equals(checkDeep, true);
    });

    it("Should pass if arrays", function () {
        var checkDeep = samsam.deepEqual(
            [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }],
            [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }]
        );
        assert.equals(checkDeep, true);
    });

    it("Should fail if nested array with shallow array", function () {
        var checkDeep = samsam.deepEqual([["hey"]], ["hey"]);
        refute.equals(checkDeep, true);
    });

    it("Should fail if arrays with different custom properties", function () {
        var arr1 = [1, 2, 3];
        var arr2 = [1, 2, 3];
        arr1.prop = 42;
        var checkDeep = samsam.deepEqual(arr1, arr2);
        refute.equals(checkDeep, true);
    });

    it("Should pass if regexp literals", function () {
        var checkDeep = samsam.deepEqual(/a/, /a/);
        assert.equals(checkDeep, true);
    });

    it("Should pass if regexp objects", function () {
        var checkDeep = samsam.deepEqual(new RegExp("[a-z]+"), new RegExp("[a-z]+"));
        assert.equals(checkDeep, true);
    });

    it("Should fail if regexp objects with custom properties", function () {
        var re1 = new RegExp("[a-z]+"); // eslint-disable-line
        var re2 = new RegExp("[a-z]+");
        re2.id = 42;
        var checkDeep = samsam.deepEqual(re1, re2);
        refute.equals(checkDeep, true);
    });

    it("Should fail if different objects", function () {
        var checkDeep = samsam.deepEqual({id: 42}, {});
        refute.equals(checkDeep, true);
    });

    it("Should fail if object to null", function () {
        var checkDeep = samsam.deepEqual({}, null);
        refute.equals(checkDeep, true);
    });

    it("Should fail if object to undefined", function () {
        var checkDeep = samsam.deepEqual({}, undefined);
        refute.equals(checkDeep, true);
    });

    it("Should fail if object to false", function () {
        var checkDeep = samsam.deepEqual({}, false);
        refute.equals(checkDeep, true);
    });

    it("Should fail if false to object", function () {
        var checkDeep = samsam.deepEqual(false, {});
        refute.equals(checkDeep, true);
    });

    it("Should fail if object to true", function () {
        var checkDeep = samsam.deepEqual({}, true);
        refute.equals(checkDeep, true);
    });

    it("Should fail if true to object", function () {
        var checkDeep = samsam.deepEqual(true, {});
        refute.equals(checkDeep, true);
    });

    it("Should fail if 'empty' object to date", function () {
        var checkDeep = samsam.deepEqual({}, new Date());
        refute.equals(checkDeep, true);
    });

    it("Should fail if 'empty' object to string object", function () {
        var checkDeep = samsam.deepEqual({}, String());
        refute.equals(checkDeep, true);
    });

    it("Should fail if 'empty' object to number object", function () {
        var checkDeep = samsam.deepEqual({}, Number());
        refute.equals(checkDeep, true);
    });

    it("Should fail if 'empty' object to empty array", function () {
        var checkDeep = samsam.deepEqual({}, []);
        refute.equals(checkDeep, true);
    });

    it("Should pass if arguments to array", function () {
        var gather = function () { return arguments; };
        var checkDeep = samsam.deepEqual([1, 2, {}, []], gather(1, 2, {}, []));
        assert.equals(checkDeep, true);
    });

    it("Should pass if array to arguments", function () {
        var gather = function () { return arguments; };
        var checkDeep = samsam.deepEqual(gather(), []);
        assert.equals(checkDeep, true);
    });

    it("Should pass if arguments to array like object", function () {
        var gather = function () { return arguments; };
        var arrayLike = { length: 4, "0": 1, "1": 2, "2": {}, "3": [] };
        var checkDeep = samsam.deepEqual(arrayLike, gather(1, 2, {}, []));
        assert.equals(checkDeep, true);
    });

    if (typeof Set !== "undefined") {
        it("Should pass sets with the same content", function () {
            var checkDeep = samsam.deepEqual(new Set([1, 2, 3]), new Set([2, 1, 3])); // eslint-disable-line
            assert.equals(checkDeep, true);
        });

        it("Should fail sets with the different content", function () {
            var checkDeep = samsam.deepEqual(new Set([1, 2, 3]), new Set([2, 5, 3])); // eslint-disable-line
            refute.equals(checkDeep, true);
        });
    }


    /**
    * Tests for cyclic objects.
    */
    describe("deepEqual (cyclic objects)", function () {
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
});
