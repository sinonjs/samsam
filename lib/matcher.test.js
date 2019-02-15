"use strict";

var assert = require("@sinonjs/referee").assert;
var refute = require("@sinonjs/referee").refute;
var createMatcher = require("./matcher");

function propertyMatcherTests(matcher, additionalTests) {
    return function() {
        it("returns matcher", function() {
            var has = matcher("foo");

            assert(createMatcher.isMatcher(has));
        });

        it("throws if first argument is not string", function() {
            assert.exception(
                function() {
                    matcher();
                },
                { name: "TypeError" }
            );
            assert.exception(
                function() {
                    matcher(123);
                },
                { name: "TypeError" }
            );
        });

        it("returns false if value is undefined or null", function() {
            var has = matcher("foo");

            assert.isFalse(has.test(undefined));
            assert.isFalse(has.test(null));
        });

        it("returns true if object has property", function() {
            var has = matcher("foo");

            assert(has.test({ foo: null }));
        });

        it("returns false if object value is not equal to given value", function() {
            var has = matcher("foo", 1);

            assert.isFalse(has.test({ foo: null }));
        });

        it("returns true if object value is equal to given value", function() {
            var has = matcher("message", "sinon rocks");

            assert(has.test({ message: "sinon rocks" }));
            assert(has.test(new Error("sinon rocks")));
        });

        it("returns true if string property matches", function() {
            var has = matcher("length", 5);

            assert(has.test("sinon"));
        });

        it("allows to expect undefined", function() {
            var has = matcher("foo", undefined);

            assert.isFalse(has.test({ foo: 1 }));
        });

        it("compares value deeply", function() {
            var has = matcher("foo", { bar: "doo", test: 42 });

            assert(has.test({ foo: { bar: "doo", test: 42 } }));
        });

        it("compares with matcher", function() {
            var has = matcher("callback", createMatcher.typeOf("function"));

            assert(has.test({ callback: function() {} }));
        });

        if (typeof additionalTests === "function") {
            additionalTests();
        }
    };
}

describe("matcher", function() {
    it("returns matcher", function() {
        var match = createMatcher(function() {});

        assert(createMatcher.isMatcher(match));
    });

    it("exposes test function", function() {
        var test = function() {};

        var match = createMatcher(test);

        assert.same(match.test, test);
    });

    it("returns true if properties are equal", function() {
        var match = createMatcher({ str: "sinon", nr: 1 });

        assert(match.test({ str: "sinon", nr: 1, other: "ignored" }));
    });

    it("returns true if properties are deep equal", function() {
        var match = createMatcher({ deep: { str: "sinon" } });

        assert(match.test({ deep: { str: "sinon", ignored: "value" } }));
    });

    it("returns false if a property is not equal", function() {
        var match = createMatcher({ str: "sinon", nr: 1 });

        assert.isFalse(match.test({ str: "sinon", nr: 2 }));
    });

    it("returns false if a property is missing", function() {
        var match = createMatcher({ str: "sinon", nr: 1 });

        assert.isFalse(match.test({ nr: 1 }));
    });

    it("returns true if array is equal", function() {
        var match = createMatcher({ arr: ["a", "b"] });

        assert(match.test({ arr: ["a", "b"] }));
    });

    it("returns false if array is not equal", function() {
        var match = createMatcher({ arr: ["b", "a"] });

        assert.isFalse(match.test({ arr: ["a", "b"] }));
    });

    it("returns false if array is not equal (even if the contents would match (deep equal))", function() {
        var match = createMatcher([{ str: "sinon" }]);

        assert.isFalse(match.test([{ str: "sinon", ignored: "value" }]));
    });

    it("returns true if number objects are equal", function() {
        /*eslint-disable no-new-wrappers*/
        var match = createMatcher({ one: new Number(1) });

        assert(match.test({ one: new Number(1) }));
        /*eslint-enable no-new-wrappers*/
    });

    it("returns true if test matches", function() {
        var match = createMatcher({ prop: createMatcher.typeOf("boolean") });

        assert(match.test({ prop: true }));
    });

    it("returns false if test does not match", function() {
        var match = createMatcher({ prop: createMatcher.typeOf("boolean") });

        assert.isFalse(match.test({ prop: "no" }));
    });

    it("returns true if deep test matches", function() {
        var match = createMatcher({
            deep: { prop: createMatcher.typeOf("boolean") }
        });

        assert(match.test({ deep: { prop: true } }));
    });

    it("returns false if deep test does not match", function() {
        var match = createMatcher({
            deep: { prop: createMatcher.typeOf("boolean") }
        });

        assert.isFalse(match.test({ deep: { prop: "no" } }));
    });

    it("returns false if tested value is null or undefined", function() {
        var match = createMatcher({});

        assert.isFalse(match.test(null));
        assert.isFalse(match.test(undefined));
    });

    it("returns true if error message matches", function() {
        var match = createMatcher({ message: "evil error" });

        assert(match.test(new Error("evil error")));
    });

    it("returns true if string property matches", function() {
        var match = createMatcher({ length: 5 });

        assert(match.test("sinon"));
    });

    it("returns true if number property matches", function() {
        var match = createMatcher({ toFixed: createMatcher.func });

        assert(match.test(0));
    });

    it("returns true for string match", function() {
        var match = createMatcher("sinon");

        assert(match.test("sinon"));
    });

    it("returns true for substring match", function() {
        var match = createMatcher("no");

        assert(match.test("sinon"));
    });

    it("returns false for string mismatch", function() {
        var match = createMatcher("Sinon.JS");

        assert.isFalse(match.test(null));
        assert.isFalse(match.test({}));
        assert.isFalse(match.test("sinon"));
        assert.isFalse(match.test("sinon.js"));
    });

    it("returns true for regexp match", function() {
        var match = createMatcher(/^[sino]+$/);

        assert(match.test("sinon"));
    });

    it("returns false for regexp string mismatch", function() {
        var match = createMatcher(/^[sin]+$/);

        assert.isFalse(match.test("sinon"));
    });

    it("returns false for regexp type mismatch", function() {
        var match = createMatcher(/.*/);

        assert.isFalse(match.test());
        assert.isFalse(match.test(null));
        assert.isFalse(match.test(123));
        assert.isFalse(match.test({}));
    });

    it("returns true for number match", function() {
        var match = createMatcher(1);

        assert(match.test(1));
        assert(match.test("1"));
        assert(match.test(true));
    });

    it("returns false for number mismatch", function() {
        var match = createMatcher(1);

        assert.isFalse(match.test());
        assert.isFalse(match.test(null));
        assert.isFalse(match.test(2));
        assert.isFalse(match.test(false));
        assert.isFalse(match.test({}));
    });

    it("returns true for Symbol match", function() {
        if (typeof Symbol === "function") {
            var symbol = Symbol();

            var match = createMatcher(symbol);

            assert(match.test(symbol));
        }
    });

    it("returns false for Symbol mismatch", function() {
        if (typeof Symbol === "function") {
            var match = createMatcher(Symbol());

            assert.isFalse(match.test());
            assert.isFalse(match.test(Symbol(null)));
            assert.isFalse(match.test(Symbol()));
            assert.isFalse(match.test(Symbol({})));
        }
    });

    it("returns true for Symbol inside object", function() {
        if (typeof Symbol === "function") {
            var symbol = Symbol();

            var match = createMatcher({ prop: symbol });

            assert(match.test({ prop: symbol }));
        }
    });

    it("returns true if test function in object returns true", function() {
        var match = createMatcher({
            test: function() {
                return true;
            }
        });

        assert(match.test());
    });

    it("returns false if test function in object returns false", function() {
        var match = createMatcher({
            test: function() {
                return false;
            }
        });

        assert.isFalse(match.test());
    });

    it("returns false if test function in object returns nothing", function() {
        var match = createMatcher({ test: function() {} });

        assert.isFalse(match.test());
    });

    it("passes actual value to test function in object", function() {
        var match = createMatcher({
            test: function(arg) {
                return arg;
            }
        });

        assert(match.test(true));
    });

    it("uses matcher", function() {
        var match = createMatcher(createMatcher("test"));

        assert(match.test("testing"));
    });

    describe(".toString", function() {
        it("returns message", function() {
            var message = "hello sinonMatch";

            var match = createMatcher(function() {}, message);

            assert.same(match.toString(), message);
        });

        it("defaults to match(functionName)", function() {
            var match = createMatcher(function custom() {});

            assert.same(match.toString(), "match(custom)");
        });
    });

    describe(".any", function() {
        it("is matcher", function() {
            assert(createMatcher.isMatcher(createMatcher.any));
        });

        it("returns true when tested", function() {
            assert(createMatcher.any.test());
        });
    });

    describe(".defined", function() {
        it("is matcher", function() {
            assert(createMatcher.isMatcher(createMatcher.defined));
        });

        it("returns false if test is called with null", function() {
            assert.isFalse(createMatcher.defined.test(null));
        });

        it("returns false if test is called with undefined", function() {
            assert.isFalse(createMatcher.defined.test(undefined));
        });

        it("returns true if test is called with any value", function() {
            assert(createMatcher.defined.test(false));
            assert(createMatcher.defined.test(true));
            assert(createMatcher.defined.test(0));
            assert(createMatcher.defined.test(1));
            assert(createMatcher.defined.test(""));
        });

        it("returns true if test is called with any object", function() {
            assert(createMatcher.defined.test({}));
            assert(createMatcher.defined.test(function() {}));
        });
    });

    describe(".truthy", function() {
        it("is matcher", function() {
            assert(createMatcher.isMatcher(createMatcher.truthy));
        });

        it("returns true if test is called with trueish value", function() {
            assert(createMatcher.truthy.test(true));
            assert(createMatcher.truthy.test(1));
            assert(createMatcher.truthy.test("yes"));
        });

        it("returns false if test is called falsy value", function() {
            assert.isFalse(createMatcher.truthy.test(false));
            assert.isFalse(createMatcher.truthy.test(null));
            assert.isFalse(createMatcher.truthy.test(undefined));
            assert.isFalse(createMatcher.truthy.test(""));
        });
    });

    describe(".falsy", function() {
        it("is matcher", function() {
            assert(createMatcher.isMatcher(createMatcher.falsy));
        });

        it("returns true if test is called falsy value", function() {
            assert(createMatcher.falsy.test(false));
            assert(createMatcher.falsy.test(null));
            assert(createMatcher.falsy.test(undefined));
            assert(createMatcher.falsy.test(""));
        });

        it("returns false if test is called with trueish value", function() {
            assert.isFalse(createMatcher.falsy.test(true));
            assert.isFalse(createMatcher.falsy.test(1));
            assert.isFalse(createMatcher.falsy.test("yes"));
        });
    });

    describe(".same", function() {
        it("returns matcher", function() {
            var same = createMatcher.same();

            assert(createMatcher.isMatcher(same));
        });

        it("returns true if test is called with same argument", function() {
            var object = {};
            var same = createMatcher.same(object);

            assert(same.test(object));
        });

        it("returns true if test is called with same symbol", function() {
            if (typeof Symbol === "function") {
                var symbol = Symbol();
                var same = createMatcher.same(symbol);

                assert(same.test(symbol));
            }
        });

        it("returns false if test is not called with same argument", function() {
            var same = createMatcher.same({});

            assert.isFalse(same.test({}));
        });
    });

    describe(".in", function() {
        it("returns matcher", function() {
            var inMatcher = createMatcher.in([]);
            assert(createMatcher.isMatcher(inMatcher));
        });

        it("throws if given argument is not an array", function() {
            var arg = "not-array";

            assert.exception(
                function() {
                    createMatcher.in(arg);
                },
                { name: "TypeError", message: "array expected" }
            );
        });

        describe("when given argument is an array", function() {
            var arrays = [
                [1, 2, 3],
                ["a", "b", "c"],
                [{ a: "a" }, { b: "b" }],
                [function() {}, function() {}],
                [null, undefined]
            ];

            it("returns true if the tested value in the given array", function() {
                arrays.forEach(function(array) {
                    var inMatcher = createMatcher.in(array);
                    assert.isTrue(inMatcher.test(array[0]));
                });
            });

            it("returns false if the tested value not in the given array", function() {
                arrays.forEach(function(array) {
                    var inMatcher = createMatcher.in(array);
                    assert.isFalse(inMatcher.test("something else"));
                });
            });
        });
    });

    describe(".typeOf", function() {
        it("throws if given argument is not a string", function() {
            assert.exception(
                function() {
                    createMatcher.typeOf();
                },
                { name: "TypeError" }
            );
            assert.exception(
                function() {
                    createMatcher.typeOf(123);
                },
                { name: "TypeError" }
            );
        });

        it("returns matcher", function() {
            var typeOf = createMatcher.typeOf("string");

            assert(createMatcher.isMatcher(typeOf));
        });

        it("returns true if test is called with string", function() {
            var typeOf = createMatcher.typeOf("string");

            assert(typeOf.test("Sinon.JS"));
        });

        it("returns false if test is not called with string", function() {
            var typeOf = createMatcher.typeOf("string");

            assert.isFalse(typeOf.test(123));
        });

        it("returns true if test is called with symbol", function() {
            if (typeof Symbol === "function") {
                var typeOf = createMatcher.typeOf("symbol");

                assert(typeOf.test(Symbol()));
            }
        });

        it("returns true if test is called with regexp", function() {
            var typeOf = createMatcher.typeOf("regexp");

            assert(typeOf.test(/.+/));
        });

        it("returns false if test is not called with regexp", function() {
            var typeOf = createMatcher.typeOf("regexp");

            assert.isFalse(typeOf.test(true));
        });
    });

    describe(".instanceOf", function() {
        it("throws if given argument is not a function", function() {
            assert.exception(
                function() {
                    createMatcher.instanceOf();
                },
                { name: "TypeError" }
            );
            assert.exception(
                function() {
                    createMatcher.instanceOf("foo");
                },
                { name: "TypeError" }
            );
        });

        if (
            typeof Symbol !== "undefined" &&
            typeof Symbol.hasInstance !== "undefined"
        ) {
            it("does not throw if given argument defines Symbol.hasInstance", function() {
                var objectWithCustomTypeChecks = {};
                objectWithCustomTypeChecks[Symbol.hasInstance] = function() {};

                refute.exception(function() {
                    createMatcher.instanceOf(objectWithCustomTypeChecks);
                });
            });
        }

        it("returns matcher", function() {
            var instanceOf = createMatcher.instanceOf(function() {});

            assert(createMatcher.isMatcher(instanceOf));
        });

        it("returns true if test is called with instance of argument", function() {
            var instanceOf = createMatcher.instanceOf(Array);

            assert(instanceOf.test([]));
        });

        it("returns false if test is not called with instance of argument", function() {
            var instanceOf = createMatcher.instanceOf(Array);

            assert.isFalse(instanceOf.test({}));
        });
    });

    describe(".has", propertyMatcherTests(createMatcher.has));
    describe(".hasOwn", propertyMatcherTests(createMatcher.hasOwn));

    describe(
        ".hasNested",
        propertyMatcherTests(createMatcher.hasNested, function() {
            it("compares nested value", function() {
                var hasNested = createMatcher.hasNested("foo.bar", "doo");

                assert(hasNested.test({ foo: { bar: "doo" } }));
            });

            it("compares nested array value", function() {
                var hasNested = createMatcher.hasNested("foo[0].bar", "doo");

                assert(hasNested.test({ foo: [{ bar: "doo" }] }));
            });
        })
    );

    describe(".hasSpecial", function() {
        it("returns true if object has inherited property", function() {
            var has = createMatcher.has("toString");

            assert(has.test({}));
        });

        it("only includes property in message", function() {
            var has = createMatcher.has("test");

            assert.equals(has.toString(), 'has("test")');
        });

        it("includes property and value in message", function() {
            var has = createMatcher.has("test", undefined);

            assert.equals(has.toString(), 'has("test", undefined)');
        });

        it("returns true if string function matches", function() {
            var has = createMatcher.has("toUpperCase", createMatcher.func);

            assert(has.test("sinon"));
        });

        it("returns true if number function matches", function() {
            var has = createMatcher.has("toFixed", createMatcher.func);

            assert(has.test(0));
        });

        it("returns true if object has Symbol", function() {
            if (typeof Symbol === "function") {
                var symbol = Symbol();

                var has = createMatcher.has("prop", symbol);

                assert(has.test({ prop: symbol }));
            }
        });

        it("returns true if embedded object has Symbol", function() {
            if (typeof Symbol === "function") {
                var symbol = Symbol();

                var has = createMatcher.has(
                    "prop",
                    createMatcher.has("embedded", symbol)
                );

                assert(has.test({ prop: { embedded: symbol }, ignored: 42 }));
            }
        });
    });

    describe(".hasOwnSpecial", function() {
        it("returns false if object has inherited property", function() {
            var hasOwn = createMatcher.hasOwn("toString");

            assert.isFalse(hasOwn.test({}));
        });

        it("only includes property in message", function() {
            var hasOwn = createMatcher.hasOwn("test");

            assert.equals(hasOwn.toString(), 'hasOwn("test")');
        });

        it("includes property and value in message", function() {
            var hasOwn = createMatcher.hasOwn("test", undefined);

            assert.equals(hasOwn.toString(), 'hasOwn("test", undefined)');
        });
    });

    describe(".every", function() {
        it("throws if given argument is not a matcher", function() {
            assert.exception(
                function() {
                    createMatcher.every({});
                },
                { name: "TypeError" }
            );
            assert.exception(
                function() {
                    createMatcher.every(123);
                },
                { name: "TypeError" }
            );
            assert.exception(
                function() {
                    createMatcher.every("123");
                },
                { name: "TypeError" }
            );
        });

        it("returns matcher", function() {
            var every = createMatcher.every(createMatcher.any);

            assert(createMatcher.isMatcher(every));
        });

        it('wraps the given matcher message with an "every()"', function() {
            var every = createMatcher.every(createMatcher.number);

            assert.equals(every.toString(), 'every(typeOf("number"))');
        });

        it("fails to match anything that is not an object or an iterable", function() {
            var every = createMatcher.every(createMatcher.any);

            refute(every.test(1));
            refute(every.test("a"));
            refute(every.test(null));
            refute(every.test(function() {}));
        });

        it("matches an object if the predicate is true for every property", function() {
            var every = createMatcher.every(createMatcher.number);

            assert(every.test({ a: 1, b: 2 }));
        });

        it("fails if the predicate is false for some of the object properties", function() {
            var every = createMatcher.every(createMatcher.number);

            refute(every.test({ a: 1, b: "b" }));
        });

        it("matches an array if the predicate is true for every element", function() {
            var every = createMatcher.every(createMatcher.number);

            assert(every.test([1, 2]));
        });

        it("fails if the predicate is false for some of the array elements", function() {
            var every = createMatcher.every(createMatcher.number);

            refute(every.test([1, "b"]));
        });

        if (typeof Set === "function") {
            it("matches an iterable if the predicate is true for every element", function() {
                var every = createMatcher.every(createMatcher.number);
                var set = new Set();
                set.add(1);
                set.add(2);

                assert(every.test(set));
            });

            it("fails if the predicate is false for some of the iterable elements", function() {
                var every = createMatcher.every(createMatcher.number);
                var set = new Set();
                set.add(1);
                set.add("b");

                refute(every.test(set));
            });
        }
    });

    describe(".some", function() {
        it("throws if given argument is not a matcher", function() {
            assert.exception(
                function() {
                    createMatcher.some({});
                },
                { name: "TypeError" }
            );
            assert.exception(
                function() {
                    createMatcher.some(123);
                },
                { name: "TypeError" }
            );
            assert.exception(
                function() {
                    createMatcher.some("123");
                },
                { name: "TypeError" }
            );
        });

        it("returns matcher", function() {
            var some = createMatcher.some(createMatcher.any);

            assert(createMatcher.isMatcher(some));
        });

        it('wraps the given matcher message with an "some()"', function() {
            var some = createMatcher.some(createMatcher.number);

            assert.equals(some.toString(), 'some(typeOf("number"))');
        });

        it("fails to match anything that is not an object or an iterable", function() {
            var some = createMatcher.some(createMatcher.any);

            refute(some.test(1));
            refute(some.test("a"));
            refute(some.test(null));
            refute(some.test(function() {}));
        });

        it("matches an object if the predicate is true for some of the properties", function() {
            var some = createMatcher.some(createMatcher.number);

            assert(some.test({ a: 1, b: "b" }));
        });

        it("fails if the predicate is false for all of the object properties", function() {
            var some = createMatcher.some(createMatcher.number);

            refute(some.test({ a: "a", b: "b" }));
        });

        it("matches an array if the predicate is true for some element", function() {
            var some = createMatcher.some(createMatcher.number);

            assert(some.test([1, "b"]));
        });

        it("fails if the predicate is false for all of the array elements", function() {
            var some = createMatcher.some(createMatcher.number);

            refute(some.test(["a", "b"]));
        });

        if (typeof Set === "function") {
            it("matches an iterable if the predicate is true for some element", function() {
                var some = createMatcher.some(createMatcher.number);
                var set = new Set();
                set.add(1);
                set.add("b");

                assert(some.test(set));
            });

            it("fails if the predicate is false for all of the iterable elements", function() {
                var some = createMatcher.some(createMatcher.number);
                var set = new Set();
                set.add("a");
                set.add("b");

                refute(some.test(set));
            });
        }
    });

    describe(".bool", function() {
        it("is typeOf boolean matcher", function() {
            var bool = createMatcher.bool;

            assert(createMatcher.isMatcher(bool));
            assert.equals(bool.toString(), 'typeOf("boolean")');
        });
    });

    describe(".number", function() {
        it("is typeOf number matcher", function() {
            var number = createMatcher.number;

            assert(createMatcher.isMatcher(number));
            assert.equals(number.toString(), 'typeOf("number")');
        });
    });

    describe(".string", function() {
        it("is typeOf string matcher", function() {
            var string = createMatcher.string;

            assert(createMatcher.isMatcher(string));
            assert.equals(string.toString(), 'typeOf("string")');
        });
    });

    describe(".object", function() {
        it("is typeOf object matcher", function() {
            var object = createMatcher.object;

            assert(createMatcher.isMatcher(object));
            assert.equals(object.toString(), 'typeOf("object")');
        });
    });

    describe(".func", function() {
        it("is typeOf function matcher", function() {
            var func = createMatcher.func;

            assert(createMatcher.isMatcher(func));
            assert.equals(func.toString(), 'typeOf("function")');
        });
    });

    describe(".array", function() {
        it("is typeOf array matcher", function() {
            var array = createMatcher.array;

            assert(createMatcher.isMatcher(array));
            assert.equals(array.toString(), 'typeOf("array")');
        });

        describe("array.deepEquals", function() {
            it("has a .deepEquals matcher", function() {
                var deepEquals = createMatcher.array.deepEquals([1, 2, 3]);

                assert(createMatcher.isMatcher(deepEquals));
                assert.equals(deepEquals.toString(), "deepEquals([1,2,3])");
            });

            describe("one-dimensional arrays", function() {
                it("matches arrays with the exact same elements", function() {
                    var deepEquals = createMatcher.array.deepEquals([1, 2, 3]);
                    assert(deepEquals.test([1, 2, 3]));
                    assert.isFalse(deepEquals.test([1, 2]));
                    assert.isFalse(deepEquals.test([3]));
                });
            });

            describe("nested arrays", function() {
                var deepEquals;
                beforeEach(function() {
                    deepEquals = createMatcher.array.deepEquals([
                        ["test"],
                        ["nested"],
                        ["arrays"],
                        [{ with: "object" }]
                    ]);
                });
                it("matches nested arrays with the exact same elements", function() {
                    assert(
                        deepEquals.test([
                            ["test"],
                            ["nested"],
                            ["arrays"],
                            [{ with: "object" }]
                        ])
                    );
                });

                it("fails when nested arrays are not in the same order", function() {
                    assert.isFalse(
                        deepEquals.test([
                            ["test"],
                            ["arrays"],
                            ["nested"],
                            [{ with: "object" }]
                        ])
                    );
                });

                it("fails when nested arrays don't have same count", function() {
                    assert.isFalse(deepEquals.test([["test"], ["arrays"]]));
                });

                it("matches nested, empty arrays", function() {
                    var empty = createMatcher.array.deepEquals([[], []]);
                    assert.isTrue(empty.test([[], []]));
                });
            });

            it("fails when passed a non-array object", function() {
                var deepEquals = createMatcher.array.deepEquals([
                    "one",
                    "two",
                    "three"
                ]);
                assert.isFalse(
                    deepEquals.test({
                        0: "one",
                        1: "two",
                        2: "three",
                        length: 3
                    })
                );
            });
        });

        describe("array.startsWith", function() {
            it("has a .startsWith matcher", function() {
                var startsWith = createMatcher.array.startsWith([1, 2]);

                assert(createMatcher.isMatcher(startsWith));
                assert.equals(startsWith.toString(), "startsWith([1,2])");
            });

            it("matches arrays starting with the same elements", function() {
                assert(createMatcher.array.startsWith([1]).test([1, 2]));
                assert(createMatcher.array.startsWith([1, 2]).test([1, 2]));
                assert.isFalse(
                    createMatcher.array.startsWith([1, 2, 3]).test([1, 2])
                );
                assert.isFalse(
                    createMatcher.array.startsWith([2]).test([1, 2])
                );
            });

            it("fails when passed a non-array object", function() {
                var startsWith = createMatcher.array.startsWith(["one", "two"]);
                assert.isFalse(
                    startsWith.test({
                        0: "one",
                        1: "two",
                        2: "three",
                        length: 3
                    })
                );
            });
        });

        describe("array.endsWith", function() {
            it("has an .endsWith matcher", function() {
                var endsWith = createMatcher.array.endsWith([2, 3]);

                assert(createMatcher.isMatcher(endsWith));
                assert.equals(endsWith.toString(), "endsWith([2,3])");
            });

            it("matches arrays ending with the same elements", function() {
                assert(createMatcher.array.endsWith([2]).test([1, 2]));
                assert(createMatcher.array.endsWith([1, 2]).test([1, 2]));
                assert.isFalse(
                    createMatcher.array.endsWith([1, 2, 3]).test([1, 2])
                );
                assert.isFalse(createMatcher.array.endsWith([3]).test([1, 2]));
            });

            it("fails when passed a non-array object", function() {
                var endsWith = createMatcher.array.endsWith(["two", "three"]);

                assert.isFalse(
                    endsWith.test({ 0: "one", 1: "two", 2: "three", length: 3 })
                );
            });
        });

        describe("array.contains", function() {
            it("has a .contains matcher", function() {
                var contains = createMatcher.array.contains([2, 3]);

                assert(createMatcher.isMatcher(contains));
                assert.equals(contains.toString(), "contains([2,3])");
            });

            it("matches arrays containing all the expected elements", function() {
                assert(createMatcher.array.contains([2]).test([1, 2, 3]));
                assert(createMatcher.array.contains([1, 2]).test([1, 2]));
                assert.isFalse(
                    createMatcher.array.contains([1, 2, 3]).test([1, 2])
                );
                assert.isFalse(createMatcher.array.contains([3]).test([1, 2]));
            });

            it("fails when passed a non-array object", function() {
                var contains = createMatcher.array.contains(["one", "three"]);

                assert.isFalse(
                    contains.test({ 0: "one", 1: "two", 2: "three", length: 3 })
                );
            });
        });
    });

    describe(".map", function() {
        it("is typeOf map matcher", function() {
            var map = createMatcher.map;

            assert(createMatcher.isMatcher(map));
            assert.equals(map.toString(), 'typeOf("map")');
        });

        describe("map.deepEquals", function() {
            if (typeof Map === "function") {
                it("has a .deepEquals matcher", function() {
                    var mapOne = new Map();
                    mapOne.set("one", 1);
                    mapOne.set("two", 2);
                    mapOne.set("three", 3);

                    var deepEquals = createMatcher.map.deepEquals(mapOne);
                    assert(createMatcher.isMatcher(deepEquals));
                    assert.equals(
                        deepEquals.toString(),
                        "deepEquals(Map[['one',1],['two',2],['three',3]])"
                    );
                });

                it("matches maps with the exact same elements", function() {
                    var mapOne = new Map();
                    mapOne.set("one", 1);
                    mapOne.set("two", 2);
                    mapOne.set("three", 3);

                    var mapTwo = new Map();
                    mapTwo.set("one", 1);
                    mapTwo.set("two", 2);
                    mapTwo.set("three", 3);

                    var mapThree = new Map();
                    mapThree.set("one", 1);
                    mapThree.set("two", 2);

                    var deepEquals = createMatcher.map.deepEquals(mapOne);
                    assert(deepEquals.test(mapTwo));
                    assert.isFalse(deepEquals.test(mapThree));
                    assert.isFalse(deepEquals.test(new Map()));
                });

                it("fails when maps have the same keys but different values", function() {
                    var mapOne = new Map();
                    mapOne.set("one", 1);
                    mapOne.set("two", 2);
                    mapOne.set("three", 3);

                    var mapTwo = new Map();
                    mapTwo.set("one", 2);
                    mapTwo.set("two", 4);
                    mapTwo.set("three", 8);

                    var mapThree = new Map();
                    mapTwo.set("one", 1);
                    mapTwo.set("two", 2);
                    mapTwo.set("three", 4);

                    var deepEquals = createMatcher.map.deepEquals(mapOne);
                    assert.isFalse(deepEquals.test(mapTwo));
                    assert.isFalse(deepEquals.test(mapThree));
                });

                it("fails when passed a non-map object", function() {
                    var deepEquals = createMatcher.array.deepEquals(new Map());
                    assert.isFalse(deepEquals.test({}));
                    assert.isFalse(deepEquals.test([]));
                });
            }
        });

        describe("map.contains", function() {
            if (typeof Map === "function") {
                it("has a .contains matcher", function() {
                    var mapOne = new Map();
                    mapOne.set("one", 1);
                    mapOne.set("two", 2);
                    mapOne.set("three", 3);

                    var contains = createMatcher.map.contains(mapOne);
                    assert(createMatcher.isMatcher(contains));
                    assert.equals(
                        contains.toString(),
                        "contains(Map[['one',1],['two',2],['three',3]])"
                    );
                });

                it("matches maps containing the given elements", function() {
                    var mapOne = new Map();
                    mapOne.set("one", 1);
                    mapOne.set("two", 2);
                    mapOne.set("three", 3);

                    var mapTwo = new Map();
                    mapTwo.set("one", 1);
                    mapTwo.set("two", 2);
                    mapTwo.set("three", 3);

                    var mapThree = new Map();
                    mapThree.set("one", 1);
                    mapThree.set("two", 2);

                    var mapFour = new Map();
                    mapFour.set("one", 1);
                    mapFour.set("four", 4);

                    assert(createMatcher.map.contains(mapTwo).test(mapOne));
                    assert(createMatcher.map.contains(mapThree).test(mapOne));
                    assert.isFalse(
                        createMatcher.map.contains(mapFour).test(mapOne)
                    );
                });

                it("fails when maps contain the same keys but different values", function() {
                    var mapOne = new Map();
                    mapOne.set("one", 1);
                    mapOne.set("two", 2);
                    mapOne.set("three", 3);

                    var mapTwo = new Map();
                    mapTwo.set("one", 2);
                    mapTwo.set("two", 4);
                    mapTwo.set("three", 8);

                    var mapThree = new Map();
                    mapThree.set("one", 1);
                    mapThree.set("two", 2);
                    mapThree.set("three", 4);

                    assert.isFalse(
                        createMatcher.map.contains(mapTwo).test(mapOne)
                    );
                    assert.isFalse(
                        createMatcher.map.contains(mapThree).test(mapOne)
                    );
                });

                it("fails when passed a non-map object", function() {
                    var contains = createMatcher.map.contains(new Map());
                    assert.isFalse(contains.test({}));
                    assert.isFalse(contains.test([]));
                });
            }
        });
    });

    describe(".set", function() {
        it("is typeOf set matcher", function() {
            var set = createMatcher.set;

            assert(createMatcher.isMatcher(set));
            assert.equals(set.toString(), 'typeOf("set")');
        });

        describe("set.deepEquals", function() {
            if (typeof Set === "function") {
                it("has a .deepEquals matcher", function() {
                    var setOne = new Set();
                    setOne.add("one");
                    setOne.add("two");
                    setOne.add("three");

                    var deepEquals = createMatcher.set.deepEquals(setOne);
                    assert(createMatcher.isMatcher(deepEquals));
                    assert.equals(
                        deepEquals.toString(),
                        "deepEquals(Set['one','two','three'])"
                    );
                });

                it("matches sets with the exact same elements", function() {
                    var setOne = new Set();
                    setOne.add("one");
                    setOne.add("two");
                    setOne.add("three");

                    var setTwo = new Set();
                    setTwo.add("one");
                    setTwo.add("two");
                    setTwo.add("three");

                    var setThree = new Set();
                    setThree.add("one");
                    setThree.add("two");

                    var deepEquals = createMatcher.set.deepEquals(setOne);
                    assert(deepEquals.test(setTwo));
                    assert.isFalse(deepEquals.test(setThree));
                    assert.isFalse(deepEquals.test(new Set()));
                });

                it("fails when passed a non-set object", function() {
                    var deepEquals = createMatcher.array.deepEquals(new Set());
                    assert.isFalse(deepEquals.test({}));
                    assert.isFalse(deepEquals.test([]));
                });
            }
        });

        describe("set.contains", function() {
            if (typeof Set === "function") {
                it("has a .contains matcher", function() {
                    var setOne = new Set();
                    setOne.add("one");
                    setOne.add("two");
                    setOne.add("three");

                    var contains = createMatcher.set.contains(setOne);
                    assert(createMatcher.isMatcher(contains));
                    assert.equals(
                        contains.toString(),
                        "contains(Set['one','two','three'])"
                    );
                });

                it("matches sets containing the given elements", function() {
                    var setOne = new Set();
                    setOne.add("one");
                    setOne.add("two");
                    setOne.add("three");

                    var setTwo = new Set();
                    setTwo.add("one");
                    setTwo.add("two");
                    setTwo.add("three");

                    var setThree = new Set();
                    setThree.add("one");
                    setThree.add("two");

                    var setFour = new Set();
                    setFour.add("one");
                    setFour.add("four");

                    assert(createMatcher.set.contains(setTwo).test(setOne));
                    assert(createMatcher.set.contains(setThree).test(setOne));
                    assert.isFalse(
                        createMatcher.set.contains(setFour).test(setOne)
                    );
                });

                it("fails when passed a non-set object", function() {
                    var contains = createMatcher.set.contains(new Set());
                    assert.isFalse(contains.test({}));
                    assert.isFalse(contains.test([]));
                });
            }
        });
    });

    describe(".regexp", function() {
        it("is typeOf regexp matcher", function() {
            var regexp = createMatcher.regexp;

            assert(createMatcher.isMatcher(regexp));
            assert.equals(regexp.toString(), 'typeOf("regexp")');
        });
    });

    describe(".date", function() {
        it("is typeOf regexp matcher", function() {
            var date = createMatcher.date;

            assert(createMatcher.isMatcher(date));
            assert.equals(date.toString(), 'typeOf("date")');
        });
    });

    describe(".symbol", function() {
        it("is typeOf symbol matcher", function() {
            var symbol = createMatcher.symbol;

            assert(createMatcher.isMatcher(symbol));
            assert.equals(symbol.toString(), 'typeOf("symbol")');
        });
    });

    describe(".or", function() {
        it("is matcher", function() {
            var numberOrString = createMatcher.number.or(createMatcher.string);

            assert(createMatcher.isMatcher(numberOrString));
            assert.equals(
                numberOrString.toString(),
                'typeOf("number").or(typeOf("string"))'
            );
        });

        it("requires matcher argument", function() {
            assert.exception(
                function() {
                    createMatcher.instanceOf(Error).or();
                },
                { name: "TypeError" }
            );
        });

        it("will coerce argument to matcher", function() {
            var abcOrDef = createMatcher("abc").or("def");

            assert(createMatcher.isMatcher(abcOrDef));
            assert.equals(abcOrDef.toString(), 'match("abc").or(match("def"))');
        });

        it("returns true if either matcher matches", function() {
            var numberOrString = createMatcher.number.or(createMatcher.string);

            assert(numberOrString.test(123));
            assert(numberOrString.test("abc"));
        });

        it("returns false if neither matcher matches", function() {
            var numberOrAbc = createMatcher.number.or("abc");

            assert.isFalse(numberOrAbc.test(/.+/));
            assert.isFalse(numberOrAbc.test(new Date()));
            assert.isFalse(numberOrAbc.test({}));
        });

        it("can be used with undefined", function() {
            var numberOrUndef = createMatcher.number.or(undefined);

            assert(numberOrUndef.test(123));
            assert(numberOrUndef.test(undefined));
        });
    });

    describe(".and", function() {
        it("is matcher", function() {
            var fooAndBar = createMatcher
                .has("foo")
                .and(createMatcher.has("bar"));

            assert(createMatcher.isMatcher(fooAndBar));
            assert.equals(fooAndBar.toString(), 'has("foo").and(has("bar"))');
        });

        it("requires matcher argument", function() {
            assert.exception(
                function() {
                    createMatcher.instanceOf(Error).and();
                },
                { name: "TypeError" }
            );
        });

        it("will coerce to matcher", function() {
            var abcOrObj = createMatcher("abc").or({ a: 1 });

            assert(createMatcher.isMatcher(abcOrObj));
            assert.equals(abcOrObj.toString(), 'match("abc").or(match(a: 1))');
        });

        it("returns true if both matchers match", function() {
            var fooAndBar = createMatcher.has("foo").and({ bar: "bar" });

            assert(fooAndBar.test({ foo: "foo", bar: "bar" }));
        });

        it("returns false if either matcher does not match", function() {
            var fooAndBar = createMatcher
                .has("foo")
                .and(createMatcher.has("bar"));

            assert.isFalse(fooAndBar.test({ foo: "foo" }));
            assert.isFalse(fooAndBar.test({ bar: "bar" }));
        });

        it("can be used with undefined", function() {
            var falsyAndUndefined = createMatcher.falsy.and(undefined);

            assert.isFalse(falsyAndUndefined.test(false));
            assert(falsyAndUndefined.test(undefined));
        });
    });

    describe("nested", function() {
        it("returns true for an object with nested matcher", function() {
            var match = createMatcher({
                outer: createMatcher({ inner: "sinon" })
            });

            assert.isTrue(
                match.test({ outer: { inner: "sinon", foo: "bar" } })
            );
        });

        it("returns true for an array of nested matchers", function() {
            var match = createMatcher([createMatcher({ str: "sinon" })]);

            assert.isTrue(match.test([{ str: "sinon", foo: "bar" }]));
        });
    });
});
