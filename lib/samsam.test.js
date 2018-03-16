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
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual(32, new Number(32));
        refute.equals(checkDeep, true);
    });

    it("Should fail if number object reverse with coercion", function () {
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual(new Number(32), 32);
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
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual("4", new String("4"));
        refute.equals(checkDeep, true);
    });

    it("Should fail if string boxing reverse with coercion", function () {
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual(new String("4"), "4");
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
        var re1 = new RegExp("[a-z]+");
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
            // eslint-disable-next-line ie11/no-collection-args
            var checkDeep = samsam.deepEqual(new Set([1, 2, 3]), new Set([2, 1, 3]));
            assert.equals(checkDeep, true);
        });

        it("Should fail sets with the different content", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkDeep = samsam.deepEqual(new Set([1, 2, 3]), new Set([2, 5, 3]));
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

describe("match", function () {
    it("Should pass if matching regexp", function () {
        var checkMatch = samsam.match("Assertions", /[a-z]/);
        assert.equals(checkMatch, true);
    });

    it("Should pass if generic object and test method returning true", function () {
        var checkMatch = samsam.match("Assertions", {
            test: function () { return true; }
        });
        assert.equals(checkMatch, true);
    });

    it("Should fail if non matching regexp", function () {
        var checkMatch = samsam.match("Assertions 123", /^[a-z]$/);
        refute.equals(checkMatch, true);
    });

    it("Should pass if matching booleans", function () {
        var checkMatch = samsam.match(true, true);
        assert.equals(checkMatch, true);
    });

    it("Should fail if mismatching booleans", function () {
        var checkMatch = samsam.match(true, false);
        refute.equals(checkMatch, true);
    });

    it("Should fail if generic object with test method returning false", function () {
        var checkMatch = samsam.match("Assertions", { test: function () { return false; } });
        refute.equals(checkMatch, true);
    });

    it("Should throw error if match object === null", function () {
        var checkMatch = samsam.match("Assertions 123", null);
        refute.equals(checkMatch, Error);
    });

    it("Should fail if match object === false", function () {
        var checkMatch = samsam.match("Assertions 123", false);
        refute.equals(checkMatch, true);
    });

    it("Should fail if matching number against string", function () {
        var checkMatch = samsam.match("Assertions", 23);
        refute.equals(checkMatch, true);
    });

    it("Should fail if matching number against similar string", function () {
        var checkMatch = samsam.match("23", 23);
        refute.equals(checkMatch, true);
    });

    it("Should pass if matching number against itself", function () {
        var checkMatch = samsam.match(23, 23);
        assert.equals(checkMatch, true);
    });

    it("Should pass if matcher function returns true", function () {
        var checkMatch = samsam.match("Assertions 123", function () { return true; });
        assert.equals(checkMatch, true);
    });

    it("Should fail if matcher function returns false", function () {
        var checkMatch = samsam.match("Assertions 123", function () { return false; });
        refute.equals(checkMatch, true);
    });

    it("Should fail if matcher function returns falsy", function () {
        var checkMatch = samsam.match("Assertions 123", function () { });
        refute.equals(checkMatch, true);
    });

    it("Should fail if matcher does not return explicit true", function () {
        var checkMatch = samsam.match("Assertions 123", function () { return "Hey"; });
        refute.equals(checkMatch, true);
    });

    it("Should pass if matcher is substring of matchee", function () {
        var checkMatch = samsam.match("Diskord", "or");
        assert.equals(checkMatch, true);
    });

    it("Should pass if matcher is string equal to matchee", function () {
        var checkMatch = samsam.match("Diskord", "Diskord");
        assert.equals(checkMatch, true);
    });

    it("Should pass if matcher is strings ignoring case", function () {
        var checkMatch = samsam.match("Look ma, case-insensitive",
            "LoOk Ma, CaSe-InSenSiTiVe");
        assert.equals(checkMatch, true);
    });

    it("Should fail if match string is not substring of matchee", function () {
        var checkMatch = samsam.match("Vim", "Emacs");
        refute.equals(checkMatch, true);
    });

    it("Should fail if match string is not substring of object", function () {
        var checkMatch = samsam.match({}, "Emacs");
        refute.equals(checkMatch, true);
    });

    it("Should fail if matcher is not substring of object.toString", function () {
        var checkMatch = samsam.match({
            toString: function () { return "Vim"; }
        }, "Emacs");
        refute.equals(checkMatch, true);
    });

    it("Should fail if null and empty string", function () {
        var checkMatch = samsam.match(null, "");
        refute.equals(checkMatch, true);
    });

    it("Should fail if undefined and empty string", function () {
        var checkMatch = samsam.match(undefined, "");
        refute.equals(checkMatch, true);
    });

    it("Should fail if false and empty string", function () {
        var checkMatch = samsam.match(false, "");
        refute.equals(checkMatch, true);
    });

    it("Should fail if 0 and empty string", function () {
        var checkMatch = samsam.match(0, "");
        refute.equals(checkMatch, true);
    });

    it("Should fail if NaN and empty string", function () {
        var checkMatch = samsam.match(NaN, "");
        refute.equals(checkMatch, true);
    });

    it("Should pass if object containing all properties in matcher", function () {
        var object = {
            id: 42,
            name: "Christian",
            doIt: "yes",

            speak: function () {
                return this.name;
            }
        };
        var checkMatch = samsam.match(object, {
            id: 42,
            doIt: "yes"
        });
        assert.equals(checkMatch, true);
    });

    it("Should pass if nested matcher", function () {
        var object = {
            id: 42,
            name: "Christian",
            doIt: "yes",
            owner: {
                someDude: "Yes",
                hello: "ok"
            },

            speak: function () {
                return this.name;
            }
        };
        var checkMatch = samsam.match(object, {
            owner: {
                someDude: "Yes",
                hello: function (value) {
                    return value === "ok";
                }
            }
        });
        assert.equals(checkMatch, true);
    });

    it("Should pass if empty strings", function () {
        var checkMatch = samsam.match("", "");
        assert.equals(checkMatch, true);
    });

    it("Should pass if empty strings as object properties", function () {
        var checkMatch = samsam.match({ foo: "" }, { foo: "" });
        assert.equals(checkMatch, true);
    });

    it("Should pass if similar arrays", function () {
        var checkMatch = samsam.match([1, 2, 3], [1, 2, 3]);
        assert.equals(checkMatch, true);
    });

    it("Should pass if array subset", function () {
        var checkMatch = samsam.match([1, 2, 3], [2, 3]);
        assert.equals(checkMatch, true);
    });

    it("Should pass if single-element array subset", function () {
        var checkMatch = samsam.match([1, 2, 3], [1]);
        assert.equals(checkMatch, true);
    });

    it("Should pass if matching array subset", function () {
        var checkMatch = samsam.match([1, 2, 3, { id: 42 }], [{ id: 42 }]);
        assert.equals(checkMatch, true);
    });

    it("Should fail if mis-matching array 'subset'", function () {
        var checkMatch = samsam.match([1, 2, 3], [2, 3, 4]);
        refute.equals(checkMatch, true);
    });

    it("Should fail if mis-ordered array 'subset'", function () {
        var checkMatch = samsam.match([1, 2, 3], [1, 3]);
        refute.equals(checkMatch, true);
    });

    it("Should fail if mis-ordered, but similar arrays of objects", function () {
        var checkMatch = samsam.match([{a: "a"}, {a: "aa"}], [{a: "aa"}, {a: "a"}]);
        refute.equals(checkMatch, true);
    });

    it("Should pass if empty arrays", function () {
        var checkMatch = samsam.match([], []);
        assert.equals(checkMatch, true);
    });

    it("Should pass if objects with empty arrays", function () {
        var checkMatch = samsam.match({ xs: [] }, { xs: [] });
        assert.equals(checkMatch, true);
    });

    it("Should fail if nested objects with different depth", function () {
        var checkMatch = samsam.match({ a: 1 }, { b: { c: 2 } });
        refute.equals(checkMatch, true);
    });

    it("Should pass if dom elements with matching data attributes", function () {
        var checkMatch = samsam.match({
            getAttribute: function (name) {
                if (name === "data-path") {
                    return "foo.bar";
                }
                return false;
            }
        }, { "data-path": "foo.bar" });
        assert.equals(checkMatch, true);
    });

    it("Should fail if dom elements with not matching data attributes", function () {
        var checkMatch = samsam.match({
            getAttribute: function (name) {
                if (name === "data-path") {
                    return "foo.foo";
                }
                return false;
            }
        }, { "data-path": "foo.bar" });
        refute.equals(checkMatch, true);
    });

    it("Should pass if equal null properties", function () {
        var checkMatch = samsam.match({ foo: null }, { foo: null });
        assert.equals(checkMatch, true);
    });

    it("Should fail if unmatched null property", function () {
        var checkMatch = samsam.match({}, { foo: null });
        refute.equals(checkMatch, true);
    });

    it("Should fail if matcher with unmatched null property", function () {
        var checkMatch = samsam.match({ foo: "arbitrary" }, { foo: null });
        refute.equals(checkMatch, true);
    });

    it("Should pass if equal undefined properties", function () {
        var checkMatch = samsam.match({ foo: undefined }, { foo: undefined });
        assert.equals(checkMatch, true);
    });

    it("Should fail if matcher with unmatched undefined property", function () {
        var checkMatch = samsam.match({ foo: "arbitrary" }, { foo: undefined });
        refute.equals(checkMatch, true);
    });

    it("Should pass if unmatched undefined property", function () {
        var checkMatch = samsam.match({}, { foo: undefined });
        assert.equals(checkMatch, true);
    });

    it("Should pass if same object matches self", function () {
        var obj = { foo: undefined };
        var checkMatch = samsam.match(obj, obj);
        assert.equals(checkMatch, true);
    });

    it("Should pass if null to null", function () {
        var checkMatch = samsam.match(null, null);
        assert.equals(checkMatch, true);
    });

    it("Should fail if null to undefined", function () {
        var checkMatch = samsam.match(null, undefined);
        refute.equals(checkMatch, true);
    });

    it("Should pass if undefined to undefined", function () {
        var checkMatch = samsam.match(undefined, undefined);
        assert.equals(checkMatch, true);
    });

    it("Should fail if undefined to null", function () {
        var checkMatch = samsam.match(undefined, null);
        refute.equals(checkMatch, true);
    });

    if (typeof Set !== "undefined") {
        it("Should pass if sets with same content", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, 2, 3]), new Set([2, 3, 1]));
            assert.equals(checkMatch, true);
        });

        it("Should pass if subsets", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, 2, 3]), new Set([3, 1]));
            assert.equals(checkMatch, true);
        });

        it("Should pass if subset complex types", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, {id: 42}, 3]), new Set([{id: 42}]));
            assert.equals(checkMatch, true);
        });

        it("Should fail if sets with dissimilar content", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, 2, 3]), new Set([2, 5, 1]));
            refute.equals(checkMatch, true);
        });

        it("Should fail if sets with different complex member", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([{id: 42}]), new Set([{id: 13}]));
            refute.equals(checkMatch, true);
        });

        it("Should pass if differently sorted complex objects", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var set1 = new Set([{
                end: "2019-08-07T18:00:00Z",
                geoAvailability: {
                    resId: "http://id.nrk.no/2015/guri/IPRights/geoavailability/NORGE",
                    title: "NORGE"
                },
                resId: "http://id.nrk.no/2015/guri/68cc0a15-2be1-4666-984f-b421b415326d/publicationEvent/0",
                start: "2015-04-03T14:00:00Z"
            }, {
                geoAvailability: {
                    resId: "http://id.nrk.no/2015/guri/IPRights/geoavailability/NRK",
                    title: "NRK"
                },
                resId: "x-test:pubEvent-1",
                start: "2015-04-03T14:00:00Z"
            }]);
            // eslint-disable-next-line ie11/no-collection-args
            var set2 = new Set([{
                geoAvailability: {
                    resId: "http://id.nrk.no/2015/guri/IPRights/geoavailability/NRK",
                    title: "NRK"
                },
                resId: "x-test:pubEvent-1",
                start: "2015-04-03T14:00:00Z"
            }, {
                end: "2019-08-07T18:00:00Z",
                geoAvailability: {
                    resId: "http://id.nrk.no/2015/guri/IPRights/geoavailability/NORGE",
                    title: "NORGE"
                },
                start: "2015-04-03T14:00:00Z"
            }]);
            var checkMatch = samsam.match(set1, set2);
            assert.equals(checkMatch, true);
        });

        it("Should pass if date objects with same date", function () {
            var date = new Date();
            var sameDate = new Date(date.getTime());
            var checkMatch = samsam.match(date, sameDate);
            assert.equals(checkMatch, true);
        });

        it("Should fail if date objects with different dates", function () {
            var date = new Date();
            var anotherDate = new Date(date.getTime() - 10);
            var checkMatch = samsam.match(date, anotherDate);
            refute.equals(checkMatch, true);
        });
    }
});

describe("isDate", function () {
    it("Should pass if valid date", function () {
        var checkDate = samsam.isDate(new Date());
        assert.equals(checkDate, true);
    });

    it("Should fail if string", function () {
        var checkDate = samsam.isDate("String");
        refute.equals(checkDate, true);
    });

    it("Should fail if Number", function () {
        var checkDate = samsam.isDate(123);
        refute.equals(checkDate, true);
    });

    it("Should fail if empty string", function () {
        var checkDate = samsam.isDate("");
        refute.equals(checkDate, true);
    });

    it("Should fail if empty object", function () {
        var checkDate = samsam.isDate({});
        refute.equals(checkDate, true);
    });

    it("Should fail if object", function () {
        var checkDate = samsam.isDate({ id: 12 });
        refute.equals(checkDate, true);
    });
});
