"use strict";

var assert = require("assert");
require("jsdom-global")();
var samsam = require("./samsam");

describe("isElement", function () {
    it("returns true if DOM element node", function () {
        if (typeof document !== "undefined") {
            var element = document.createElement("div");
            var checkElement = samsam.isElement(element);
            assert.strictEqual(checkElement, true);
        }
    });

    it("returns false if DOM text node", function () {
        if (typeof document !== "undefined") {
            var element = document.createTextNode("Hello");
            var checkElement = samsam.isElement(element);
            assert.strictEqual(checkElement, false);
        }
    });

    it("returns false if node like object", function () {
        var nodeLike = { nodeType: 1 };
        var checkElement = samsam.isElement(nodeLike);
        assert.strictEqual(checkElement, false);
    });

    it("returns false if number", function () {
        var checkElement = samsam.isElement(42);
        assert.strictEqual(checkElement, false);
    });

    it("returns false if object", function () {
        var checkElement = samsam.isElement({});
        assert.strictEqual(checkElement, false);
    });
});

describe("isArguments", function () {
    it("returns true if arguments is an object", function () {
        var checkArgs = samsam.isArguments(arguments);
        assert.strictEqual(checkArgs, true);
    });

    it("returns false if number", function () {
        var checkArgs = samsam.isArguments(24);
        assert.strictEqual(checkArgs, false);
    });

    it("returns false if empty object", function () {
        var checkArgs = samsam.isArguments({});
        assert.strictEqual(checkArgs, false);
    });

    it("returns true if arguments object from strict-mode function", function () {
        var returnArgs = function () {
            return arguments;
        };
        var checkArgs = samsam.isArguments(returnArgs());
        assert.strictEqual(checkArgs, true);
    });
});

describe("isNegZero", function () {
    it("returns true if negative zero", function () {
        var checkZero = samsam.isNegZero(-0);
        assert.strictEqual(checkZero, true);
    });

    it("returns false if zero", function () {
        var checkZero = samsam.isNegZero(0);
        assert.strictEqual(checkZero, false);
    });

    it("returns false if object", function () {
        var checkZero = samsam.isNegZero({});
        assert.strictEqual(checkZero, false);
    });

    it("returns false if String", function () {
        var checkZero = samsam.isNegZero("-0");
        assert.strictEqual(checkZero, false);
    });
});

describe("identical", function () {
    it("returns true if strings are identical", function () {
        var str = "string";
        var checkIdent = samsam.identical(str, str);
        assert.strictEqual(checkIdent, true);
    });

    it("returns true if objects are identical", function () {
        var obj = { id: 42 };
        var checkIdent = samsam.identical(obj, obj);
        assert.strictEqual(checkIdent, true);
    });

    it("returns true if NaN", function () {
        var checkIdent = samsam.identical(NaN, NaN);
        assert.strictEqual(checkIdent, true);
    });

    it("returns false if equal but different type", function () {
        var checkIdent = samsam.identical(0, "0");
        assert.strictEqual(checkIdent, false);
    });

    it("returns false on -0 and 0", function () {
        var checkIdent = samsam.identical(0, -0);
        assert.strictEqual(checkIdent, false);
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

    it("returns true if object to itself", function () {
        var checkDeep = samsam.deepEqual(obj, obj);
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if strings", function () {
        var checkDeep = samsam.deepEqual("string", "string");
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if numbers", function () {
        var checkDeep = samsam.deepEqual(32, 32);
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if boolean", function () {
        var checkDeep = samsam.deepEqual(false, false);
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if null", function () {
        var checkDeep = samsam.deepEqual(null, null);
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if undefined", function () {
        var checkDeep = samsam.deepEqual(undefined, undefined);
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if function to itself", function () {
        var checkDeep = samsam.deepEqual(func, func);
        assert.strictEqual(checkDeep, true);
    });

    it("returns false if different functions", function () {
        var checkDeep = samsam.deepEqual(function () {}, function () {});
        assert.strictEqual(checkDeep, false);
    });

    it("returns true if array to itself", function () {
        var checkDeep = samsam.deepEqual(arr, arr);
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if date objects with same date", function () {
        var checkDeep = samsam.deepEqual(date, sameDate);
        assert.strictEqual(checkDeep, true);
    });

    it("returns false if date objects with different dates", function () {
        var checkDeep = samsam.deepEqual(date, sameDateWithProp);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if strings and numbers with coercion", function () {
        var checkDeep = samsam.deepEqual("4", 4);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if numbers and strings with coercion", function () {
        var checkDeep = samsam.deepEqual(4, "4");
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if number object with coercion", function () {
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual(32, new Number(32));
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if number object reverse with coercion", function () {
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual(new Number(32), 32);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if falsy values with coercion", function () {
        var checkDeep = samsam.deepEqual(0, "");
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if falsy values reverse with coercion", function () {
        var checkDeep = samsam.deepEqual("", 0);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if string boxing with coercion", function () {
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual("4", new String("4"));
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if string boxing reverse with coercion", function () {
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual(new String("4"), "4");
        assert.strictEqual(checkDeep, false);
    });

    it("returns true if NaN to Nan", function () {
        var checkDeep = samsam.deepEqual(NaN, NaN);
        assert.strictEqual(checkDeep, true);
    });

    it("returns false if -0 to +0", function () {
        var checkDeep = samsam.deepEqual(+0, -0);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if -0 to 0", function () {
        var checkDeep = samsam.deepEqual(-0, 0);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if objects with different own properties", function () {
        var checkDeep = samsam.deepEqual({ id: 42 }, { id: 42, di: 24 });
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if objects with different own properties values", function () {
        var checkDeep = samsam.deepEqual({ id: 42 }, { id: undefined });
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if objects with one property with different values", function () {
        var checkDeep = samsam.deepEqual({ id: 42 }, { id: 24 });
        assert.strictEqual(checkDeep, false);
    });

    it("returns true if complex objects", function () {
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
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if arrays", function () {
        var checkDeep = samsam.deepEqual(
            [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }],
            [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }]
        );
        assert.strictEqual(checkDeep, true);
    });

    it("returns false if nested array with shallow array", function () {
        var checkDeep = samsam.deepEqual([["hey"]], ["hey"]);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if arrays with different custom properties", function () {
        var arr1 = [1, 2, 3];
        var arr2 = [1, 2, 3];
        arr1.prop = 42;
        var checkDeep = samsam.deepEqual(arr1, arr2);
        assert.strictEqual(checkDeep, false);
    });

    it("returns true if regexp literals", function () {
        var checkDeep = samsam.deepEqual(/a/, /a/);
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if regexp objects", function () {
        var checkDeep = samsam.deepEqual(new RegExp("[a-z]+"), new RegExp("[a-z]+"));
        assert.strictEqual(checkDeep, true);
    });

    it("returns false if regexp objects with custom properties", function () {
        var re1 = new RegExp("[a-z]+");
        var re2 = new RegExp("[a-z]+");
        re2.id = 42;
        var checkDeep = samsam.deepEqual(re1, re2);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if different objects", function () {
        var checkDeep = samsam.deepEqual({id: 42}, {});
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if object to null", function () {
        var checkDeep = samsam.deepEqual({}, null);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if object to undefined", function () {
        var checkDeep = samsam.deepEqual({}, undefined);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if object to false", function () {
        var checkDeep = samsam.deepEqual({}, false);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if false to object", function () {
        var checkDeep = samsam.deepEqual(false, {});
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if object to true", function () {
        var checkDeep = samsam.deepEqual({}, true);
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if true to object", function () {
        var checkDeep = samsam.deepEqual(true, {});
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if 'empty' object to date", function () {
        var checkDeep = samsam.deepEqual({}, new Date());
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if 'empty' object to string object", function () {
        var checkDeep = samsam.deepEqual({}, String());
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if 'empty' object to number object", function () {
        var checkDeep = samsam.deepEqual({}, Number());
        assert.strictEqual(checkDeep, false);
    });

    it("returns false if 'empty' object to empty array", function () {
        var checkDeep = samsam.deepEqual({}, []);
        assert.strictEqual(checkDeep, false);
    });

    it("returns true if arguments to array", function () {
        var gather = function () { return arguments; };
        var checkDeep = samsam.deepEqual([1, 2, {}, []], gather(1, 2, {}, []));
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if array to arguments", function () {
        var gather = function () { return arguments; };
        var checkDeep = samsam.deepEqual(gather(), []);
        assert.strictEqual(checkDeep, true);
    });

    it("returns true if arguments to array like object", function () {
        var gather = function () { return arguments; };
        var arrayLike = { length: 4, "0": 1, "1": 2, "2": {}, "3": [] };
        var checkDeep = samsam.deepEqual(arrayLike, gather(1, 2, {}, []));
        assert.strictEqual(checkDeep, true);
    });

    if (typeof Set !== "undefined") {
        it("returns true if set with the same content", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkDeep = samsam.deepEqual(new Set([1, 2, 3]), new Set([2, 1, 3]));
            assert.strictEqual(checkDeep, true);
        });

        it("returns false if set with the different content", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkDeep = samsam.deepEqual(new Set([1, 2, 3]), new Set([2, 5, 3]));
            assert.strictEqual(checkDeep, false);
        });

        it("returns false on set compared with something else", function () {
            // eslint-disable-next-line ie11/no-collection-args
            assert.strictEqual(samsam.deepEqual(new Set([1, 2, 3]), "string"), false);
            // eslint-disable-next-line ie11/no-collection-args
            assert.strictEqual(samsam.deepEqual(new Set([1, 2, 3]), false), false);
            // eslint-disable-next-line ie11/no-collection-args
            assert.strictEqual(samsam.deepEqual(new Set([1, 2, 3]), true), false);
            // eslint-disable-next-line ie11/no-collection-args
            assert.strictEqual(samsam.deepEqual(new Set([1, 2, 3]), 123), false);
        });
    }

    /**
    * Tests for cyclic objects.
    */
    describe("deepEqual (cyclic objects)", function () {
        it("returns true if equal cyclic objects (cycle on 2nd level)", function () {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = cyclic1;
            cyclic2.ref = cyclic2;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.strictEqual(checkDeep, true);
        });

        it("returns false if different cyclic objects (cycle on 2nd level)", function () {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = cyclic1;
            cyclic2.ref = cyclic2;
            cyclic2.ref2 = cyclic2;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.strictEqual(checkDeep, false);
        });

        it("returns true if equal cyclic objects (cycle on 3rd level)", function () {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = {};
            cyclic1.ref.ref = cyclic1;
            cyclic2.ref = {};
            cyclic2.ref.ref = cyclic2;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.strictEqual(checkDeep, true);
        });

        it("returns false if different cyclic objects (cycle on 3rd level)", function () {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = {};
            cyclic1.ref.ref = cyclic1;
            cyclic2.ref = {};
            cyclic2.ref.ref = cyclic2;
            cyclic2.ref.ref2 = cyclic2;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.strictEqual(checkDeep, false);
        });

        it("returns true if equal objects even though only one object is cyclic", function () {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = cyclic1;
            cyclic2.ref = cyclic1;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.strictEqual(checkDeep, true);
        });

        it("returns true if referencing different but equal cyclic objects", function () {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = {
                ref: cyclic1
            };
            cyclic2.ref = {};
            cyclic2.ref.ref = cyclic2.ref;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.strictEqual(checkDeep, true);
        });

        it("returns false if referencing different and unequal cyclic objects", function () {
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
            assert.strictEqual(checkDeep, false);
        });
    });
});

describe("match", function () {
    it("returns true if matching regexp", function () {
        var checkMatch = samsam.match("Assertions", /[a-z]/);
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if generic object and test method returning true", function () {
        var checkMatch = samsam.match("Assertions", {
            test: function () { return true; }
        });
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if non matching regexp", function () {
        var checkMatch = samsam.match("Assertions 123", /^[a-z]$/);
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if matching booleans", function () {
        var checkMatch = samsam.match(true, true);
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if mismatching booleans", function () {
        var checkMatch = samsam.match(true, false);
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if generic object with test method returning false", function () {
        var checkMatch = samsam.match("Assertions", { test: function () { return false; } });
        assert.strictEqual(checkMatch, false);
    });

    it("should throw error if match object === null", function () {
        var checkMatch = samsam.match("Assertions 123", null);
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if match object === false", function () {
        var checkMatch = samsam.match("Assertions 123", false);
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if matching number against string", function () {
        var checkMatch = samsam.match("Assertions", 23);
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if matching number against similar string", function () {
        var checkMatch = samsam.match("23", 23);
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if matching number against itself", function () {
        var checkMatch = samsam.match(23, 23);
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if matcher function returns true", function () {
        var checkMatch = samsam.match("Assertions 123", function () { return true; });
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if matcher function returns false", function () {
        var checkMatch = samsam.match("Assertions 123", function () { return false; });
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if matcher function returns falsy", function () {
        var checkMatch = samsam.match("Assertions 123", function () { });
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if matcher does not return explicit true", function () {
        var checkMatch = samsam.match("Assertions 123", function () { return "Hey"; });
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if matcher is substring of matchee", function () {
        var checkMatch = samsam.match("Diskord", "or");
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if matcher is string equal to matchee", function () {
        var checkMatch = samsam.match("Diskord", "Diskord");
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if matcher is strings ignoring case", function () {
        var checkMatch = samsam.match("Look ma, case-insensitive",
            "LoOk Ma, CaSe-InSenSiTiVe");
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if match string is not substring of matchee", function () {
        var checkMatch = samsam.match("Vim", "Emacs");
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if match string is not substring of object", function () {
        var checkMatch = samsam.match({}, "Emacs");
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if matcher is not substring of object.toString", function () {
        var checkMatch = samsam.match({
            toString: function () { return "Vim"; }
        }, "Emacs");
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if null and empty string", function () {
        var checkMatch = samsam.match(null, "");
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if undefined and empty string", function () {
        var checkMatch = samsam.match(undefined, "");
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if false and empty string", function () {
        var checkMatch = samsam.match(false, "");
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if 0 and empty string", function () {
        var checkMatch = samsam.match(0, "");
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if NaN and empty string", function () {
        var checkMatch = samsam.match(NaN, "");
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if object containing all properties in matcher", function () {
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
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if nested matcher", function () {
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
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if empty strings", function () {
        var checkMatch = samsam.match("", "");
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if empty strings as object properties", function () {
        var checkMatch = samsam.match({ foo: "" }, { foo: "" });
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if similar arrays", function () {
        var checkMatch = samsam.match([1, 2, 3], [1, 2, 3]);
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if array subset", function () {
        var checkMatch = samsam.match([1, 2, 3], [2, 3]);
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if single-element array subset", function () {
        var checkMatch = samsam.match([1, 2, 3], [1]);
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if matching array subset", function () {
        var checkMatch = samsam.match([1, 2, 3, { id: 42 }], [{ id: 42 }]);
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if mis-matching array 'subset'", function () {
        var checkMatch = samsam.match([1, 2, 3], [2, 3, 4]);
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if mis-ordered array 'subset'", function () {
        var checkMatch = samsam.match([1, 2, 3], [1, 3]);
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if mis-ordered, but similar arrays of objects", function () {
        var checkMatch = samsam.match([{a: "a"}, {a: "aa"}], [{a: "aa"}, {a: "a"}]);
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if empty arrays", function () {
        var checkMatch = samsam.match([], []);
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if objects with empty arrays", function () {
        var checkMatch = samsam.match({ xs: [] }, { xs: [] });
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if nested objects with different depth", function () {
        var checkMatch = samsam.match({ a: 1 }, { b: { c: 2 } });
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if dom elements with matching data attributes", function () {
        var checkMatch = samsam.match({
            getAttribute: function (name) {
                if (name === "data-path") {
                    return "foo.bar";
                }
                return false;
            }
        }, { "data-path": "foo.bar" });
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if dom elements with not matching data attributes", function () {
        var checkMatch = samsam.match({
            getAttribute: function (name) {
                if (name === "data-path") {
                    return "foo.foo";
                }
                return false;
            }
        }, { "data-path": "foo.bar" });
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if equal null properties", function () {
        var checkMatch = samsam.match({ foo: null }, { foo: null });
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if unmatched null property", function () {
        var checkMatch = samsam.match({}, { foo: null });
        assert.strictEqual(checkMatch, false);
    });

    it("returns false if matcher with unmatched null property", function () {
        var checkMatch = samsam.match({ foo: "arbitrary" }, { foo: null });
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if equal undefined properties", function () {
        var checkMatch = samsam.match({ foo: undefined }, { foo: undefined });
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if matcher with unmatched undefined property", function () {
        var checkMatch = samsam.match({ foo: "arbitrary" }, { foo: undefined });
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if unmatched undefined property", function () {
        var checkMatch = samsam.match({}, { foo: undefined });
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if same object matches self", function () {
        var obj = { foo: undefined };
        var checkMatch = samsam.match(obj, obj);
        assert.strictEqual(checkMatch, true);
    });

    it("returns true if null to null", function () {
        var checkMatch = samsam.match(null, null);
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if null to undefined", function () {
        var checkMatch = samsam.match(null, undefined);
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if undefined to undefined", function () {
        var checkMatch = samsam.match(undefined, undefined);
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if undefined to null", function () {
        var checkMatch = samsam.match(undefined, null);
        assert.strictEqual(checkMatch, false);
    });

    it("returns true if date objects with same date", function () {
        var date = new Date();
        var sameDate = new Date(date.getTime());
        var checkMatch = samsam.match(date, sameDate);
        assert.strictEqual(checkMatch, true);
    });

    it("returns false if date objects with different dates", function () {
        var date = new Date();
        var anotherDate = new Date(date.getTime() - 10);
        var checkMatch = samsam.match(date, anotherDate);
        assert.strictEqual(checkMatch, false);
    });

    if (typeof Set !== "undefined") {
        it("returns true if sets with same content", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, 2, 3]), new Set([2, 3, 1]));
            assert.strictEqual(checkMatch, true);
        });

        it("returns true if subsets", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, 2, 3]), new Set([3, 1]));
            assert.strictEqual(checkMatch, true);
        });

        it("returns true if subset complex types", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, {id: 42}, 3]), new Set([{id: 42}]));
            assert.strictEqual(checkMatch, true);
        });

        it("returns false if sets with dissimilar content", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, 2, 3]), new Set([2, 5, 1]));
            assert.strictEqual(checkMatch, false);
        });

        it("returns false if sets with different complex member", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([{id: 42}]), new Set([{id: 13}]));
            assert.strictEqual(checkMatch, false);
        });

        it("returns true if differently sorted complex objects", function () {
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
            assert.strictEqual(checkMatch, true);
        });

        it("returns false on set compared with something else", function () {
            // eslint-disable-next-line ie11/no-collection-args
            assert.strictEqual(samsam.match(new Set([1, 2, 3]), "string"), false);
            // eslint-disable-next-line ie11/no-collection-args
            assert.strictEqual(samsam.match(new Set([1, 2, 3]), false), false);
            // eslint-disable-next-line ie11/no-collection-args
            assert.strictEqual(samsam.match(new Set([1, 2, 3]), true), false);
            // eslint-disable-next-line ie11/no-collection-args
            assert.strictEqual(samsam.match(new Set([1, 2, 3]), 123), false);
        });
    }
});

describe("isDate", function () {
    it("returns true if valid date", function () {
        var checkDate = samsam.isDate(new Date());
        assert.strictEqual(checkDate, true);
    });

    it("returns false if string", function () {
        var checkDate = samsam.isDate("String");
        assert.strictEqual(checkDate, false);
    });

    it("returns false if Number", function () {
        var checkDate = samsam.isDate(123);
        assert.strictEqual(checkDate, false);
    });

    it("returns false if empty string", function () {
        var checkDate = samsam.isDate("");
        assert.strictEqual(checkDate, false);
    });

    it("returns false if empty object", function () {
        var checkDate = samsam.isDate({});
        assert.strictEqual(checkDate, false);
    });

    it("returns false if object", function () {
        var checkDate = samsam.isDate({ id: 12 });
        assert.strictEqual(checkDate, false);
    });
});
