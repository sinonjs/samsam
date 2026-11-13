"use strict";

const assert = require("@sinonjs/referee").assert;
const createSet = require("./create-set");
const createMatcher = require("./create-matcher");
const deleteRequireCache = require("./delete-require-cache");
const forEach = require("@sinonjs/commons").prototypes.array.forEach;
const functionName = require("@sinonjs/commons").functionName;
const ARRAY_TYPES = require("./array-types");

const samsam = require("./samsam");

/**
 * Creates Error instances with the provided message and a defined `stack` property
 *
 * IE11 doesn't populate the `stack` property of an Error until it is thrown,
 * making deepEqual misreport equality on that platform.
 *
 * @private
 * @param  {String} message
 * @returns {Error}
 */
function createError(message) {
    try {
        throw new Error(message);
    } catch (error) {
        return error;
    }
}

describe("deepEqual", function () {
    // eslint-disable-next-line no-empty-function
    const func = function () {};
    const obj = {};
    const arr = [];
    const date = new Date();
    // eslint-disable-next-line mocha/no-setup-in-describe
    const sameDate = new Date(date.getTime());
    // eslint-disable-next-line mocha/no-setup-in-describe
    const sameDateWithProp = new Date(date.getTime());
    // eslint-disable-next-line mocha/no-setup-in-describe
    sameDateWithProp.prop = 42;

    it("returns true if object to itself", function () {
        const checkDeep = samsam.deepEqual(obj, obj);
        assert.isTrue(checkDeep);
    });

    it("returns true if strings", function () {
        const checkDeep = samsam.deepEqual("string", "string");
        assert.isTrue(checkDeep);
    });

    it("returns true if numbers", function () {
        const checkDeep = samsam.deepEqual(32, 32);
        assert.isTrue(checkDeep);
    });

    it("returns true if boolean", function () {
        const checkDeep = samsam.deepEqual(false, false);
        assert.isTrue(checkDeep);
    });

    it("returns true if null", function () {
        const checkDeep = samsam.deepEqual(null, null);
        assert.isTrue(checkDeep);
    });

    it("returns true if undefined", function () {
        const checkDeep = samsam.deepEqual(undefined, undefined);
        assert.isTrue(checkDeep);
    });

    it("returns true if function to itself", function () {
        const checkDeep = samsam.deepEqual(func, func);
        assert.isTrue(checkDeep);
    });

    it("returns false if different functions", function () {
        const checkDeep = samsam.deepEqual(
            // eslint-disable-next-line no-empty-function
            () => {},
            // eslint-disable-next-line no-empty-function
            () => {},
        );
        assert.isFalse(checkDeep);
    });

    it("returns true if array to itself", function () {
        const checkDeep = samsam.deepEqual(arr, arr);
        assert.isTrue(checkDeep);
    });

    it("returns true if date objects with same date", function () {
        const checkDeep = samsam.deepEqual(date, sameDate);
        assert.isTrue(checkDeep);
    });

    it("returns false if date objects with different dates", function () {
        const checkDeep = samsam.deepEqual(date, sameDateWithProp);
        assert.isFalse(checkDeep);
    });

    it("returns false if strings and numbers with coercion", function () {
        const checkDeep = samsam.deepEqual("4", 4);
        assert.isFalse(checkDeep);
    });

    it("returns false if numbers and strings with coercion", function () {
        const checkDeep = samsam.deepEqual(4, "4");
        assert.isFalse(checkDeep);
    });

    it("returns false if number object with coercion", function () {
        // eslint-disable-next-line no-new-wrappers
        const checkDeep = samsam.deepEqual(32, new Number(32));
        assert.isFalse(checkDeep);
    });

    it("returns false if number object reverse with coercion", function () {
        // eslint-disable-next-line no-new-wrappers
        const checkDeep = samsam.deepEqual(new Number(32), 32);
        assert.isFalse(checkDeep);
    });

    it("returns false if falsy values with coercion", function () {
        const checkDeep = samsam.deepEqual(0, "");
        assert.isFalse(checkDeep);
    });

    it("returns false if falsy values reverse with coercion", function () {
        const checkDeep = samsam.deepEqual("", 0);
        assert.isFalse(checkDeep);
    });

    it("returns false if string boxing with coercion", function () {
        // eslint-disable-next-line no-new-wrappers
        const checkDeep = samsam.deepEqual("4", new String("4"));
        assert.isFalse(checkDeep);
    });

    it("returns false if string boxing reverse with coercion", function () {
        // eslint-disable-next-line no-new-wrappers
        const checkDeep = samsam.deepEqual(new String("4"), "4");
        assert.isFalse(checkDeep);
    });

    it("returns true if NaN to Nan", function () {
        const checkDeep = samsam.deepEqual(NaN, NaN);
        assert.isTrue(checkDeep);
    });

    it("returns false if -0 to +0", function () {
        const checkDeep = samsam.deepEqual(+0, -0);
        assert.isFalse(checkDeep);
    });

    it("returns false if -0 to 0", function () {
        const checkDeep = samsam.deepEqual(-0, 0);
        assert.isFalse(checkDeep);
    });

    it("returns false if objects with different own properties", function () {
        const checkDeep = samsam.deepEqual({ id: 42 }, { id: 42, di: 24 });
        assert.isFalse(checkDeep);
    });

    it("returns false if objects with different own properties values", function () {
        const checkDeep = samsam.deepEqual({ id: 42 }, { id: undefined });
        assert.isFalse(checkDeep);
    });

    it("returns false if objects with one property with different values", function () {
        const checkDeep = samsam.deepEqual({ id: 42 }, { id: 24 });
        assert.isFalse(checkDeep);
    });

    it("returns true if complex objects", function () {
        const deepObject = {
            id: 42,
            name: "Hey",
            sayIt() {
                return this.name;
            },

            child: {
                // eslint-disable-next-line no-empty-function
                speaking() {},
            },
        };
        const checkDeep = samsam.deepEqual(deepObject, {
            sayIt: deepObject.sayIt,
            child: { speaking: deepObject.child.speaking },
            id: 42,
            name: "Hey",
        });
        assert.isTrue(checkDeep);
    });

    it("compares enumerable props on the prototype", function () {
        class Url {
            #value;
            constructor(str) {
                this.#value = str;
            }
            get proto() {
                return this.#value.split("://")[0];
            }

            get domain() {
                return this.#value.split("://")[1];
            }
        }
        // getters are not enumerable by default, but they are configurable, so let's make them enumerable!
        Object.defineProperty(Url.prototype, "proto", { enumerable: true });
        Object.defineProperty(Url.prototype, "domain", { enumerable: true });

        const u1 = new Url("foo://bar");
        const u2 = new Url("bar://baz");
        const u3 = new Url("bar://baz");
        assert.isFalse(samsam.deepEqual(u1, u2));
        assert.isTrue(samsam.deepEqual(u3, u2));
    });

    it("returns false for objects with different enumerable string keys and equal key counts", function () {
        assert.isFalse(
            samsam.deepEqual(
                { a: 1, b: 2, c: 3 },
                { a: 1, b: 2, foo: undefined },
            ),
        );
    });

    it("returns false for prototype enumerable getters with different names and equal key counts", function () {
        class LeftUrl {
            #value;
            constructor(str) {
                this.#value = str;
            }
            get proto() {
                return this.#value.split("://")[0];
            }

            get domain() {
                return this.#value.split("://")[1];
            }
        }

        class RightUrl {
            #value;
            constructor(str) {
                this.#value = str;
            }
            get proto() {
                return this.#value.split("://")[0];
            }

            get host() {
                return this.#value.split("://")[1];
            }
        }

        Object.defineProperty(LeftUrl.prototype, "proto", { enumerable: true });
        Object.defineProperty(LeftUrl.prototype, "domain", {
            enumerable: true,
        });
        Object.defineProperty(RightUrl.prototype, "proto", {
            enumerable: true,
        });
        Object.defineProperty(RightUrl.prototype, "host", { enumerable: true });

        assert.isFalse(
            samsam.deepEqual(
                new LeftUrl("foo://bar"),
                new RightUrl("foo://bar"),
            ),
        );
    });

    it("returns true object without prototype compared to equal object with prototype", function () {
        const obj1 = Object.create(null);
        obj1.a = 1;
        obj1.b = 2;
        obj1.c = "hey";

        const obj2 = { a: 1, b: 2, c: "hey" };

        assert.isTrue(samsam.deepEqual(obj1, obj2));
    });

    it("returns true object with prototype compared to equal object without prototype", function () {
        const obj1 = { a: 1, b: 2, c: "hey" };

        const obj2 = Object.create(null);
        obj2.a = 1;
        obj2.b = 2;
        obj2.c = "hey";

        assert.isTrue(samsam.deepEqual(obj1, obj2));
    });

    it("returns true equal objects without prototypes", function () {
        const obj1 = Object.create(null);
        obj1.a = 1;
        obj1.b = 2;
        obj1.c = "hey";

        const obj2 = Object.create(null);
        obj2.a = 1;
        obj2.b = 2;
        obj2.c = "hey";

        assert.isTrue(samsam.deepEqual(obj1, obj2));
    });

    it("returns true equal objects that override hasOwnProperty", function () {
        const obj1 = { a: 1, b: 2, c: "hey", hasOwnProperty: "silly" };
        const obj2 = { a: 1, b: 2, c: "hey", hasOwnProperty: "silly" };

        assert.isTrue(samsam.deepEqual(obj1, obj2));
    });

    it("returns false for error and object", function () {
        assert.isFalse(samsam.deepEqual(createError(), {}));
        assert.isFalse(samsam.deepEqual({}, createError()));
    });

    it("returns true if regexp literals", function () {
        const checkDeep = samsam.deepEqual(/a/, /a/);
        assert.isTrue(checkDeep);
    });

    it("returns true if regexp objects", function () {
        const checkDeep = samsam.deepEqual(
            new RegExp("[a-z]+"),
            new RegExp("[a-z]+"),
        );
        assert.isTrue(checkDeep);
    });

    it("returns false if regexp objects with custom properties", function () {
        const re1 = new RegExp("[a-z]+");
        const re2 = new RegExp("[a-z]+");
        re2.id = 42;
        const checkDeep = samsam.deepEqual(re1, re2);
        assert.isFalse(checkDeep);
    });

    it("returns true equal regexps with same ignoreCase flags", function () {
        const regexp1 = /foo/i;
        const regexp2 = /foo/i;

        assert.isTrue(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns false unequal regexps with different ignoreCase flags", function () {
        const regexp1 = /foo/i;
        const regexp2 = /foo/;

        assert.isFalse(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns true equal regexps with same multiline flags", function () {
        const regexp1 = /foo/m;
        const regexp2 = /foo/m;

        assert.isTrue(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns false unequal regexps with different multiline flags", function () {
        const regexp1 = /foo/m;
        const regexp2 = /foo/;

        assert.isFalse(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns true equal regexps with same global flags", function () {
        const regexp1 = /foo/g;
        const regexp2 = /foo/g;

        assert.isTrue(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns false unequal regexps with different global flags", function () {
        const regexp1 = /foo/g;
        const regexp2 = /foo/;

        assert.isFalse(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns true equal regexps with multiple flags", function () {
        const regexp1 = /bar/im;
        const regexp2 = /bar/im;

        assert.isTrue(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns false unequal regexps with multiple flags", function () {
        const regexp1 = /bar/im;
        const regexp2 = /bar/gi;

        assert.isFalse(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns false for errors created with different constructors", function () {
        const error1 = new Error("apple pie");
        const error2 = new TypeError("apple pie");

        // make sure they have the same stack, as we also compare on that
        error1.stack = error2.stack;

        assert.isFalse(samsam.deepEqual(error1, error2));
    });

    it("returns false for errors with different message properties", function () {
        const error1 = createError("first message");
        const error2 = createError("second message");

        assert.isFalse(samsam.deepEqual(error1, error2));
    });

    it("returns false for errors with different stack properties", function () {
        const error1 = createError();
        const error2 = createError();

        error1.stack = "6e1f1c88-490e-47ba-a361-7aedb1b9333a";
        error2.stack = "83e4abf0-317b-403e-9e5e-47ad1c4638d9";

        assert.isFalse(samsam.deepEqual(error1, error2));
    });

    it("returns false for regexp and object", function () {
        assert.isFalse(samsam.deepEqual(/.*/, {}));
        assert.isFalse(samsam.deepEqual({}, /.*/));
    });

    it("returns false if different objects", function () {
        const checkDeep = samsam.deepEqual({ id: 42 }, {});
        assert.isFalse(checkDeep);
    });

    it("returns false when comparing two similar matchers to each other", function () {
        const matcher1 = createMatcher.has("foo");
        const matcher2 = createMatcher.has("foo");

        const checkDeep = samsam.deepEqual(matcher1, matcher2);
        assert.isFalse(checkDeep);
    });

    it("returns true if comparing the same instance of a matcher to itself", function () {
        const matcher1 = createMatcher.has("foo");

        const checkDeep = samsam.deepEqual(matcher1, matcher1);
        assert.isTrue(checkDeep);
    });

    describe("with symbol properties", function () {
        let symbol;

        before(function () {
            if (typeof Symbol === "function") {
                symbol = Symbol("id");
            } else {
                this.skip();
            }
        });

        it("returns false if object has different symbolic properties", function () {
            const obj1 = {};
            const obj2 = {};
            obj1[symbol] = 42;
            obj2[symbol] = 43;
            const checkDeep = samsam.deepEqual(obj1, obj2);
            assert.isFalse(checkDeep);
        });

        it("returns true if object has same symbolic properties", function () {
            const obj1 = {};
            const obj2 = {};
            obj1[symbol] = 42;
            obj2[symbol] = 42;
            const checkDeep = samsam.deepEqual(obj1, obj2);
            assert.isTrue(checkDeep);
        });

        it("returns false if object missing expected symbolic properties", function () {
            const obj1 = {};
            const obj2 = {};
            obj2[symbol] = 42;
            const checkDeep = samsam.deepEqual(obj1, obj2);
            assert.isFalse(checkDeep);
        });

        it("returns true if object contains additional symbolic properties", function () {
            const obj1 = {};
            const obj2 = {};
            obj1[symbol] = 42;
            const checkDeep = samsam.deepEqual(obj1, obj2);
            assert.isTrue(checkDeep);
        });

        it("returns true if object contains additional symbolic properties alongside matching string keys", function () {
            const actual = { a: 1 };
            actual[symbol] = 2;

            assert.isTrue(samsam.deepEqual(actual, { a: 1 }));
        });
    });

    it("returns false if object to null", function () {
        const checkDeep = samsam.deepEqual({}, null);
        assert.isFalse(checkDeep);
    });

    it("returns false if object to undefined", function () {
        const checkDeep = samsam.deepEqual({}, undefined);
        assert.isFalse(checkDeep);
    });

    it("returns false if object to false", function () {
        const checkDeep = samsam.deepEqual({}, false);
        assert.isFalse(checkDeep);
    });

    it("returns false if false to object", function () {
        const checkDeep = samsam.deepEqual(false, {});
        assert.isFalse(checkDeep);
    });

    it("returns false if object to true", function () {
        const checkDeep = samsam.deepEqual({}, true);
        assert.isFalse(checkDeep);
    });

    it("returns false if true to object", function () {
        const checkDeep = samsam.deepEqual(true, {});
        assert.isFalse(checkDeep);
    });

    it("returns false if 'empty' object to date", function () {
        const checkDeep = samsam.deepEqual({}, new Date());
        assert.isFalse(checkDeep);
    });

    it("returns false if 'empty' object to string object", function () {
        const checkDeep = samsam.deepEqual({}, String());
        assert.isFalse(checkDeep);
    });

    it("returns false if 'empty' object to number object", function () {
        const checkDeep = samsam.deepEqual({}, Number());
        assert.isFalse(checkDeep);
    });

    it("returns false if 'empty' object to empty array", function () {
        const checkDeep = samsam.deepEqual({}, []);
        assert.isFalse(checkDeep);
    });

    describe("with arguments expectation", function () {
        before(function () {
            if (typeof Symbol !== "function") {
                this.skip();
            }
        });

        it("returns false if array to arguments", function () {
            const gather = function () {
                // eslint-disable-next-line prefer-rest-params -- the test needs a real arguments object
                return arguments;
            };
            const checkDeep = samsam.deepEqual(
                [1, 2, {}, []],
                gather(1, 2, {}, []),
            );
            assert.isTrue(checkDeep);
        });

        it("returns false if array like object to arguments", function () {
            const gather = function () {
                // eslint-disable-next-line prefer-rest-params -- the test needs a real arguments object
                return arguments;
            };
            const arrayLike = { length: 4, 0: 1, 1: 2, 2: {}, 3: [] };
            const checkDeep = samsam.deepEqual(arrayLike, gather(1, 2, {}, []));
            assert.isFalse(checkDeep);
        });
    });

    it("returns true if arguments to array", function () {
        const gather = function () {
            // eslint-disable-next-line prefer-rest-params -- the test needs a real arguments object
            return arguments;
        };
        const checkDeep = samsam.deepEqual(gather(), []);
        assert.isTrue(checkDeep);
    });

    it("returns true if arguments to array like object", function () {
        const gather = function () {
            // eslint-disable-next-line prefer-rest-params -- the test needs a real arguments object
            return arguments;
        };
        const arrayLike = { length: 4, 0: 1, 1: 2, 2: {}, 3: [] };
        const checkDeep = samsam.deepEqual(gather(1, 2, {}, []), arrayLike);
        assert.isTrue(checkDeep);
    });

    it("returns false if arguments to array have not same length", function () {
        const gather = function () {
            // eslint-disable-next-line prefer-rest-params -- the test needs a real arguments object
            return arguments;
        };
        const checkDeep = samsam.deepEqual(gather(), [0]);

        assert.isFalse(checkDeep);
    });

    it("returns true for same error", function () {
        const error = createError();
        assert.isTrue(samsam.deepEqual(error, error));
    });

    it("return false if empty object to empty instance", function () {
        // Because eslint-config-sinon disables es6, we can't
        // use a class definition here
        // https://github.com/sinonjs/eslint-config-sinon/blob/master/index.js
        // var instance = new (class TestClass {});
        // eslint-disable-next-line no-empty-function
        const instance = new (function TestClass() {})();
        assert.isFalse(samsam.deepEqual(obj, instance));
    });

    it("fails unequal errors", function () {
        const error1 = new Error();
        const error2 = new Error();

        assert.isFalse(samsam.deepEqual(error1, error2));
    });

    describe("DOM", function () {
        before(function () {
            if (typeof document !== "undefined") {
                this.samsam = samsam;
                return;
            }
            this.jsdom = require("jsdom-global")();
            // Reload all files to properly apply jsdom
            deleteRequireCache(require, "./is-element");
            deleteRequireCache(require, "./deep-equal");
            deleteRequireCache(require, "./samsam");
            this.samsam = require("./samsam");
        });

        after(function () {
            delete this.samsam;
            if (this.jsdom) {
                this.jsdom();
            }
        });

        it("passes same DOM elements", function () {
            const element = document.createElement("div");

            assert.isTrue(this.samsam.deepEqual(element, element));
        });

        it("fails different DOM elements", function () {
            const element = document.createElement("div");
            const el = document.createElement("div");

            assert.isFalse(this.samsam.deepEqual(element, el));
        });

        it("does not modify DOM elements when comparing them", function () {
            const el = document.createElement("div");
            document.body.appendChild(el);
            this.samsam.deepEqual(el, {});

            assert.same(el.parentNode, document.body);
            assert.equals(el.childNodes.length, 0);
        });
    });

    if (typeof Set !== "undefined") {
        it("returns true if set with the same content", function () {
            const checkDeep = samsam.deepEqual(
                createSet([1, 2, 3]),
                createSet([2, 1, 3]),
            );

            assert.isTrue(checkDeep);
        });

        it("returns false if set with the different content", function () {
            const checkDeep = samsam.deepEqual(
                createSet([1, 2, 3]),
                createSet([2, 5, 3]),
            );

            assert.isFalse(checkDeep);
        });

        it("returns false on set compared with something else", function () {
            assert.isFalse(samsam.deepEqual(createSet([1, 2, 3]), "string"));
            assert.isFalse(samsam.deepEqual(createSet([1, 2, 3]), false));
            assert.isFalse(samsam.deepEqual(createSet([1, 2, 3]), true));
            assert.isFalse(samsam.deepEqual(createSet([1, 2, 3]), 123));
        });
    }

    describe("when called with Set", function () {
        before(function () {
            if (typeof Set !== "function") {
                this.skip();
            }
        });

        it("should return `false` for different sized sets", function () {
            const a = new Set();
            const b = new Set();

            a.add("a");

            assert.isFalse(samsam.deepEqual(a, b));
        });

        it("should return `false` for different custom properties", function () {
            const a = new Set();
            const b = new Set();

            a.add("a");
            b.add("a");

            a.prop = 42;

            assert.isFalse(samsam.deepEqual(a, b));
        });

        it("should return `true` for equal sets", function () {
            const VALUES = ["apple pie", "cherry pie", "key lime pie"];

            const s1 = new Set();
            const s2 = new Set();

            VALUES.forEach((value) => {
                s1.add(value);
                s2.add(value);
            });

            assert.isTrue(samsam.deepEqual(s1, s2));
        });

        it("should return `false` for un-equal sets", function () {
            const VALUES = ["apple pie", "cherry pie", "key lime pie"];

            const s1 = new Set();

            VALUES.forEach((value) => {
                s1.add(value);
            });

            const s2 = new Set();
            VALUES.slice(1).forEach((value) => {
                s2.add(value);
            });

            assert.isFalse(samsam.deepEqual(s1, s2));
        });
    });

    describe("when called with equal Map", function () {
        before(function () {
            if (typeof Map !== "function") {
                this.skip();
            }
        });

        it("should return false when other value is not a Map", function () {
            const a = new Map();
            const b = [];

            assert.isFalse(samsam.deepEqual(a, b));
            assert.isFalse(samsam.deepEqual(b, a));
        });

        it("should return false for different sized maps", function () {
            const a = new Map();
            const b = new Map();

            a.set("a", "a");

            assert.isFalse(samsam.deepEqual(a, b));
        });

        it("should return false for different custom properties", function () {
            const a = new Map();
            const b = new Map();

            a.set("a", "a");
            b.set("a", "a");

            a.prop = 42;

            assert.isFalse(samsam.deepEqual(a, b));
        });

        it("should return true for equal values", function () {
            const a = new Map();
            a.set(1, "a");
            a.set(2, "b");

            const b = new Map();
            b.set(1, "a");
            b.set(2, "b");

            assert.isTrue(samsam.deepEqual(a, b));
        });

        it("should return false for unequal values", function () {
            const a = new Map();
            a.set(1, "a");
            a.set(2, "b");

            const b = new Map();
            b.set(3, "c");
            b.set(4, "d");

            assert.isFalse(samsam.deepEqual(a, b));
        });
    });

    /**
     * Tests for cyclic objects.
     */
    describe("deepEqual (cyclic objects)", function () {
        it("returns true if equal cyclic objects (cycle on 2nd level)", function () {
            const cyclic1 = {};
            const cyclic2 = {};
            cyclic1.ref = cyclic1;
            cyclic2.ref = cyclic2;
            const checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isTrue(checkDeep);
        });

        it("returns false if different cyclic objects (cycle on 2nd level)", function () {
            const cyclic1 = {};
            const cyclic2 = {};
            cyclic1.ref = cyclic1;
            cyclic2.ref = cyclic2;
            cyclic2.ref2 = cyclic2;
            const checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isFalse(checkDeep);
        });

        it("returns true if equal cyclic objects (cycle on 3rd level)", function () {
            const cyclic1 = {};
            const cyclic2 = {};
            cyclic1.ref = {};
            cyclic1.ref.ref = cyclic1;
            cyclic2.ref = {};
            cyclic2.ref.ref = cyclic2;
            const checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isTrue(checkDeep);
        });

        it("returns false if different cyclic objects (cycle on 3rd level)", function () {
            const cyclic1 = {};
            const cyclic2 = {};
            cyclic1.ref = {};
            cyclic1.ref.ref = cyclic1;
            cyclic2.ref = {};
            cyclic2.ref.ref = cyclic2;
            cyclic2.ref.ref2 = cyclic2;
            const checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isFalse(checkDeep);
        });

        it("returns true if equal objects even though only one object is cyclic", function () {
            const cyclic1 = {};
            const cyclic2 = {};
            cyclic1.ref = cyclic1;
            cyclic2.ref = cyclic1;
            const checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isTrue(checkDeep);
        });

        it("returns true if referencing different but equal cyclic objects", function () {
            const cyclic1 = {};
            const cyclic2 = {};
            cyclic1.ref = {
                ref: cyclic1,
            };
            cyclic2.ref = {};
            cyclic2.ref.ref = cyclic2.ref;
            const checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isTrue(checkDeep);
        });

        it("returns false if referencing different and unequal cyclic objects", function () {
            const cyclic1 = { a: "a" };
            const cyclic2 = { a: "a" };
            cyclic1.ref = {
                b: "b",
                ref: cyclic1,
            };
            cyclic2.ref = {
                b: "b",
            };
            cyclic2.ref.ref = cyclic2.ref;
            const checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isFalse(checkDeep);
        });
    });

    describe("arrays", function () {
        function instantiate(Klass) {
            return function (value) {
                return new Klass(value);
            };
        }
        // eslint-disable-next-line mocha/no-setup-in-describe
        forEach(ARRAY_TYPES, function (value, index) {
            before(function () {
                if (typeof value === "undefined") {
                    this.skip();
                }
            });

            const createArray = instantiate(value);

            // eslint-disable-next-line mocha/no-setup-in-describe
            describe(functionName(value), function () {
                it("returns true on same typed array", function () {
                    const array = createArray([0, 1]);
                    const checkDeep = samsam.deepEqual(array, array);
                    assert.isTrue(checkDeep);
                });

                it("returns true on identical content", function () {
                    const checkDeep = samsam.deepEqual(
                        createArray([0, 1]),
                        createArray([0, 1]),
                    );
                    assert.isTrue(checkDeep);
                });

                it("returns false on different content", function () {
                    const checkDeep = samsam.deepEqual(
                        createArray([0, 1]),
                        createArray([0]),
                    );
                    assert.isFalse(checkDeep);
                });

                it("returns false if arrays with different custom properties", function () {
                    const array1 = createArray([0, 1]);
                    const array2 = createArray([0, 1]);
                    array1.prop = 42;
                    const checkDeep = samsam.deepEqual(array1, array2);
                    assert.isFalse(checkDeep);
                });

                it("returns false on different types", function () {
                    const precursor =
                        (index === 0 ? ARRAY_TYPES.length : index) - 1;
                    const checkDeep = samsam.deepEqual(
                        createArray([0, 1]),
                        instantiate(ARRAY_TYPES[precursor])([0, 1]),
                    );
                    assert.isFalse(checkDeep);
                });
            });
        });

        describe("with complex content", function () {
            it("returns true if nested matcher inside array", function () {
                const checkDeep = samsam.deepEqual(
                    {
                        prop: [
                            function () {
                                return;
                            },
                        ],
                    },
                    samsam.createMatcher({ prop: [samsam.match.func] }),
                );
                assert.isTrue(checkDeep);
            });

            it("returns true if arrays", function () {
                const checkDeep = samsam.deepEqual(
                    [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }],
                    [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }],
                );
                assert.isTrue(checkDeep);
            });

            it("returns false if nested array with shallow array", function () {
                const checkDeep = samsam.deepEqual([["hey"]], ["hey"]);
                assert.isFalse(checkDeep);
            });

            it("returns true for buffers with identical content", function () {
                if (!globalThis.Buffer) {
                    this.skip();
                }
                const checkDeep = samsam.deepEqual(
                    Buffer.from("Hello"),
                    Buffer.from("Hello"),
                );
                assert.isTrue(checkDeep);
            });
        });
    });

    describe("promises", function () {
        it("returns true if the same promise instance is compared", function () {
            const promise = Promise.resolve();
            const checkDeep = samsam.deepEqual(promise, promise);
            assert.isTrue(checkDeep);
        });

        it("returns false if a different promise instance is compared", function () {
            const promise1 = Promise.resolve();
            const promise2 = Promise.resolve();
            const checkDeep = samsam.deepEqual(promise1, promise2);
            assert.isFalse(checkDeep);
        });
    });

    describe("nested iterable", function () {
        let buildInstance;

        before(function () {
            class Foo {
                constructor(size = 0) {
                    this.size = size;
                }
            }
            Foo.prototype[Symbol.iterator] = function () {
                let count = 1;
                const size = this.size;
                return {
                    next() {
                        return count <= size
                            ? { value: count++, done: false }
                            : { value: undefined, done: true };
                    },
                };
            };
            buildInstance = function (size) {
                return new Foo(size);
            };
        });

        it("return true if same size", function () {
            assert.isTrue(
                samsam.deepEqual(
                    { a: buildInstance(2) },
                    { a: buildInstance(2) },
                ),
            );
        });

        it("return false if different size", function () {
            assert.isFalse(
                samsam.deepEqual(
                    { a: buildInstance(2) },
                    { a: buildInstance(3) },
                ),
            );
        });
    });
});
