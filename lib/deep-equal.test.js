"use strict";

var assert = require("@sinonjs/referee").assert;
var createSet = require("./create-set");

require("jsdom-global")();
var samsam = require("./samsam");

/**
 * Creates Error instances with the provided message and a defined `stack` property
 *
 * IE11 doesn't populate the `stack` property of an Error until it is thrown,
 * making deepEqual misreport equality on that platform.
 * @param  {String} message
 * @return {Error}
 */
function createError(message) {
    try {
        throw new Error(message);
    } catch (error) {
        return error;
    }
}

describe("deepEqual", function() {
    var func = function() {};
    var obj = {};
    var arr = [];
    var symbol = Symbol("id");
    var date = new Date();
    var sameDate = new Date(date.getTime());
    var sameDateWithProp = new Date(date.getTime());
    sameDateWithProp.prop = 42;

    it("returns true if object to itself", function() {
        var checkDeep = samsam.deepEqual(obj, obj);
        assert.isTrue(checkDeep);
    });

    it("returns true if strings", function() {
        var checkDeep = samsam.deepEqual("string", "string");
        assert.isTrue(checkDeep);
    });

    it("returns true if numbers", function() {
        var checkDeep = samsam.deepEqual(32, 32);
        assert.isTrue(checkDeep);
    });

    it("returns true if boolean", function() {
        var checkDeep = samsam.deepEqual(false, false);
        assert.isTrue(checkDeep);
    });

    it("returns true if null", function() {
        var checkDeep = samsam.deepEqual(null, null);
        assert.isTrue(checkDeep);
    });

    it("returns true if undefined", function() {
        var checkDeep = samsam.deepEqual(undefined, undefined);
        assert.isTrue(checkDeep);
    });

    it("returns true if function to itself", function() {
        var checkDeep = samsam.deepEqual(func, func);
        assert.isTrue(checkDeep);
    });

    it("returns false if different functions", function() {
        var checkDeep = samsam.deepEqual(function() {}, function() {});
        assert.isFalse(checkDeep);
    });

    it("returns true if array to itself", function() {
        var checkDeep = samsam.deepEqual(arr, arr);
        assert.isTrue(checkDeep);
    });

    it("returns true if date objects with same date", function() {
        var checkDeep = samsam.deepEqual(date, sameDate);
        assert.isTrue(checkDeep);
    });

    it("returns false if date objects with different dates", function() {
        var checkDeep = samsam.deepEqual(date, sameDateWithProp);
        assert.isFalse(checkDeep);
    });

    it("returns false if strings and numbers with coercion", function() {
        var checkDeep = samsam.deepEqual("4", 4);
        assert.isFalse(checkDeep);
    });

    it("returns false if numbers and strings with coercion", function() {
        var checkDeep = samsam.deepEqual(4, "4");
        assert.isFalse(checkDeep);
    });

    it("returns false if number object with coercion", function() {
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual(32, new Number(32));
        assert.isFalse(checkDeep);
    });

    it("returns false if number object reverse with coercion", function() {
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual(new Number(32), 32);
        assert.isFalse(checkDeep);
    });

    it("returns false if falsy values with coercion", function() {
        var checkDeep = samsam.deepEqual(0, "");
        assert.isFalse(checkDeep);
    });

    it("returns false if falsy values reverse with coercion", function() {
        var checkDeep = samsam.deepEqual("", 0);
        assert.isFalse(checkDeep);
    });

    it("returns false if string boxing with coercion", function() {
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual("4", new String("4"));
        assert.isFalse(checkDeep);
    });

    it("returns false if string boxing reverse with coercion", function() {
        // eslint-disable-next-line no-new-wrappers
        var checkDeep = samsam.deepEqual(new String("4"), "4");
        assert.isFalse(checkDeep);
    });

    it("returns true if NaN to Nan", function() {
        var checkDeep = samsam.deepEqual(NaN, NaN);
        assert.isTrue(checkDeep);
    });

    it("returns false if -0 to +0", function() {
        var checkDeep = samsam.deepEqual(+0, -0);
        assert.isFalse(checkDeep);
    });

    it("returns false if -0 to 0", function() {
        var checkDeep = samsam.deepEqual(-0, 0);
        assert.isFalse(checkDeep);
    });

    it("returns false if objects with different own properties", function() {
        var checkDeep = samsam.deepEqual({ id: 42 }, { id: 42, di: 24 });
        assert.isFalse(checkDeep);
    });

    it("returns false if objects with different own properties values", function() {
        var checkDeep = samsam.deepEqual({ id: 42 }, { id: undefined });
        assert.isFalse(checkDeep);
    });

    it("returns false if objects with one property with different values", function() {
        var checkDeep = samsam.deepEqual({ id: 42 }, { id: 24 });
        assert.isFalse(checkDeep);
    });

    it("returns true if complex objects", function() {
        var deepObject = {
            id: 42,
            name: "Hey",
            sayIt: function() {
                return this.name;
            },

            child: {
                speaking: function() {}
            }
        };
        var checkDeep = samsam.deepEqual(deepObject, {
            sayIt: deepObject.sayIt,
            child: { speaking: deepObject.child.speaking },
            id: 42,
            name: "Hey"
        });
        assert.isTrue(checkDeep);
    });

    it("returns true object without prototype compared to equal object with prototype", function() {
        var obj1 = Object.create(null);
        obj1.a = 1;
        obj1.b = 2;
        obj1.c = "hey";

        var obj2 = { a: 1, b: 2, c: "hey" };

        assert.isTrue(samsam.deepEqual(obj1, obj2));
    });

    it("returns true object with prototype compared to equal object without prototype", function() {
        var obj1 = { a: 1, b: 2, c: "hey" };

        var obj2 = Object.create(null);
        obj2.a = 1;
        obj2.b = 2;
        obj2.c = "hey";

        assert.isTrue(samsam.deepEqual(obj1, obj2));
    });

    it("returns true equal objects without prototypes", function() {
        var obj1 = Object.create(null);
        obj1.a = 1;
        obj1.b = 2;
        obj1.c = "hey";

        var obj2 = Object.create(null);
        obj2.a = 1;
        obj2.b = 2;
        obj2.c = "hey";

        assert.isTrue(samsam.deepEqual(obj1, obj2));
    });

    it("returns true equal objects that override hasOwnProperty", function() {
        var obj1 = { a: 1, b: 2, c: "hey", hasOwnProperty: "silly" };
        var obj2 = { a: 1, b: 2, c: "hey", hasOwnProperty: "silly" };

        assert.isTrue(samsam.deepEqual(obj1, obj2));
    });

    it("returns false for error and object", function() {
        assert.isFalse(samsam.deepEqual(createError(), {}));
        assert.isFalse(samsam.deepEqual({}, createError()));
    });

    it("returns true if arrays", function() {
        var checkDeep = samsam.deepEqual(
            [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }],
            [1, 2, "Hey there", func, { id: 42, prop: [2, 3] }]
        );
        assert.isTrue(checkDeep);
    });

    it("returns false if nested array with shallow array", function() {
        var checkDeep = samsam.deepEqual([["hey"]], ["hey"]);
        assert.isFalse(checkDeep);
    });

    it("returns false if arrays with different custom properties", function() {
        var arr1 = [1, 2, 3];
        var arr2 = [1, 2, 3];
        arr1.prop = 42;
        var checkDeep = samsam.deepEqual(arr1, arr2);
        assert.isFalse(checkDeep);
    });

    it("returns true if regexp literals", function() {
        var checkDeep = samsam.deepEqual(/a/, /a/);
        assert.isTrue(checkDeep);
    });

    it("returns true if regexp objects", function() {
        var checkDeep = samsam.deepEqual(
            new RegExp("[a-z]+"),
            new RegExp("[a-z]+")
        );
        assert.isTrue(checkDeep);
    });

    it("returns false if regexp objects with custom properties", function() {
        var re1 = new RegExp("[a-z]+");
        var re2 = new RegExp("[a-z]+");
        re2.id = 42;
        var checkDeep = samsam.deepEqual(re1, re2);
        assert.isFalse(checkDeep);
    });

    it("returns true equal regexps with same ignoreCase flags", function() {
        var regexp1 = /foo/i;
        var regexp2 = /foo/i;

        assert.isTrue(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns false unequal regexps with different ignoreCase flags", function() {
        var regexp1 = /foo/i;
        var regexp2 = /foo/;

        assert.isFalse(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns true equal regexps with same multiline flags", function() {
        var regexp1 = /foo/m;
        var regexp2 = /foo/m;

        assert.isTrue(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns false unequal regexps with different multiline flags", function() {
        var regexp1 = /foo/m;
        var regexp2 = /foo/;

        assert.isFalse(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns true equal regexps with same global flags", function() {
        var regexp1 = /foo/g;
        var regexp2 = /foo/g;

        assert.isTrue(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns false unequal regexps with different global flags", function() {
        var regexp1 = /foo/g;
        var regexp2 = /foo/;

        assert.isFalse(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns true equal regexps with multiple flags", function() {
        var regexp1 = /bar/im;
        var regexp2 = /bar/im;

        assert.isTrue(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns false unequal regexps with multiple flags", function() {
        var regexp1 = /bar/im;
        var regexp2 = /bar/gi;

        assert.isFalse(samsam.deepEqual(regexp1, regexp2));
    });

    it("returns false for errors created with different constructors", function() {
        var error1 = new Error("apple pie");
        var error2 = new TypeError("apple pie");

        // make sure they have the same stack, as we also compare on that
        error1.stack = error2.stack;

        assert.isFalse(samsam.deepEqual(error1, error2));
    });

    it("returns false for errors with different message properties", function() {
        var error1 = createError("first message");
        var error2 = createError("second message");

        assert.isFalse(samsam.deepEqual(error1, error2));
    });

    it("returns false for errors with different stack properties", function() {
        var error1 = createError();
        var error2 = createError();

        error1.stack = "6e1f1c88-490e-47ba-a361-7aedb1b9333a";
        error2.stack = "83e4abf0-317b-403e-9e5e-47ad1c4638d9";

        assert.isFalse(samsam.deepEqual(error1, error2));
    });

    it("returns false for regexp and object", function() {
        assert.isFalse(samsam.deepEqual(/.*/, {}));
        assert.isFalse(samsam.deepEqual({}, /.*/));
    });

    it("returns false if different objects", function() {
        var checkDeep = samsam.deepEqual({ id: 42 }, {});
        assert.isFalse(checkDeep);
    });

    it("returns false if object has different symbolic properties", function() {
        var checkDeep = samsam.deepEqual({ [symbol]: 42 }, { [symbol]: 43 });
        assert.isFalse(checkDeep);
    });

    it("returns true if object has same symbolic properties", function() {
        var checkDeep = samsam.deepEqual({ [symbol]: 42 }, { [symbol]: 42 });
        assert.isTrue(checkDeep);
    });

    it("returns false if object missing expected symbolic properties", function() {
        var checkDeep = samsam.deepEqual({ [symbol]: 42 }, {});
        assert.isFalse(checkDeep);
    });

    it("returns true if object contains additional symbolic properties", function() {
        var checkDeep = samsam.deepEqual({}, { [symbol]: 42 });
        assert.isTrue(checkDeep);
    });

    it("returns false if object to null", function() {
        var checkDeep = samsam.deepEqual({}, null);
        assert.isFalse(checkDeep);
    });

    it("returns false if object to undefined", function() {
        var checkDeep = samsam.deepEqual({}, undefined);
        assert.isFalse(checkDeep);
    });

    it("returns false if object to false", function() {
        var checkDeep = samsam.deepEqual({}, false);
        assert.isFalse(checkDeep);
    });

    it("returns false if false to object", function() {
        var checkDeep = samsam.deepEqual(false, {});
        assert.isFalse(checkDeep);
    });

    it("returns false if object to true", function() {
        var checkDeep = samsam.deepEqual({}, true);
        assert.isFalse(checkDeep);
    });

    it("returns false if true to object", function() {
        var checkDeep = samsam.deepEqual(true, {});
        assert.isFalse(checkDeep);
    });

    it("returns false if 'empty' object to date", function() {
        var checkDeep = samsam.deepEqual({}, new Date());
        assert.isFalse(checkDeep);
    });

    it("returns false if 'empty' object to string object", function() {
        var checkDeep = samsam.deepEqual({}, String());
        assert.isFalse(checkDeep);
    });

    it("returns false if 'empty' object to number object", function() {
        var checkDeep = samsam.deepEqual({}, Number());
        assert.isFalse(checkDeep);
    });

    it("returns false if 'empty' object to empty array", function() {
        var checkDeep = samsam.deepEqual({}, []);
        assert.isFalse(checkDeep);
    });

    it("returns true if arguments to array", function() {
        var gather = function() {
            return arguments;
        };
        var checkDeep = samsam.deepEqual([1, 2, {}, []], gather(1, 2, {}, []));
        assert.isTrue(checkDeep);
    });

    it("returns true if array to arguments", function() {
        var gather = function() {
            return arguments;
        };
        var checkDeep = samsam.deepEqual(gather(), []);
        assert.isTrue(checkDeep);
    });

    it("returns true if arguments to array like object", function() {
        var gather = function() {
            return arguments;
        };
        var arrayLike = { length: 4, "0": 1, "1": 2, "2": {}, "3": [] };
        var checkDeep = samsam.deepEqual(arrayLike, gather(1, 2, {}, []));
        assert.isTrue(checkDeep);
    });

    it("returns true for same error", function() {
        var error = createError();
        assert.isTrue(samsam.deepEqual(error, error));
    });

    it("passes same DOM elements", function() {
        var element = document.createElement("div");

        assert.isTrue(samsam.deepEqual(element, element));
    });

    it("return false if empty object to empty instance", function() {
        // Because eslint-config-sinon disables es6, we can't
        // use a class definition here
        // https://github.com/sinonjs/eslint-config-sinon/blob/master/index.js
        // var instance = new (class TestClass {});
        var instance = new function TestClass() {}();
        assert.isFalse(samsam.deepEqual(obj, instance));
    });

    it("fails different DOM elements", function() {
        var element = document.createElement("div");
        var el = document.createElement("div");

        assert.isFalse(samsam.deepEqual(element, el));
    });

    it("does not modify DOM elements when comparing them", function() {
        var el = document.createElement("div");
        document.body.appendChild(el);
        samsam.deepEqual(el, {});

        assert.same(el.parentNode, document.body);
        assert.equals(el.childNodes.length, 0);
    });

    it("fails unequal errors", function() {
        var error1 = new Error();
        var error2 = new Error();

        assert.isFalse(samsam.deepEqual(error1, error2));
    });

    if (typeof Set !== "undefined") {
        it("returns true if set with the same content", function() {
            var checkDeep = samsam.deepEqual(
                createSet([1, 2, 3]),
                createSet([2, 1, 3])
            );

            assert.isTrue(checkDeep);
        });

        it("returns false if set with the different content", function() {
            var checkDeep = samsam.deepEqual(
                createSet([1, 2, 3]),
                createSet([2, 5, 3])
            );

            assert.isFalse(checkDeep);
        });

        it("returns false on set compared with something else", function() {
            assert.isFalse(samsam.deepEqual(createSet([1, 2, 3]), "string"));
            assert.isFalse(samsam.deepEqual(createSet([1, 2, 3]), false));
            assert.isFalse(samsam.deepEqual(createSet([1, 2, 3]), true));
            assert.isFalse(samsam.deepEqual(createSet([1, 2, 3]), 123));
        });
    }

    /**
     * Tests for cyclic objects.
     */
    describe("deepEqual (cyclic objects)", function() {
        it("returns true if equal cyclic objects (cycle on 2nd level)", function() {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = cyclic1;
            cyclic2.ref = cyclic2;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isTrue(checkDeep);
        });

        it("returns false if different cyclic objects (cycle on 2nd level)", function() {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = cyclic1;
            cyclic2.ref = cyclic2;
            cyclic2.ref2 = cyclic2;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isFalse(checkDeep);
        });

        it("returns true if equal cyclic objects (cycle on 3rd level)", function() {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = {};
            cyclic1.ref.ref = cyclic1;
            cyclic2.ref = {};
            cyclic2.ref.ref = cyclic2;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isTrue(checkDeep);
        });

        it("returns false if different cyclic objects (cycle on 3rd level)", function() {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = {};
            cyclic1.ref.ref = cyclic1;
            cyclic2.ref = {};
            cyclic2.ref.ref = cyclic2;
            cyclic2.ref.ref2 = cyclic2;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isFalse(checkDeep);
        });

        it("returns true if equal objects even though only one object is cyclic", function() {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = cyclic1;
            cyclic2.ref = cyclic1;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isTrue(checkDeep);
        });

        it("returns true if referencing different but equal cyclic objects", function() {
            var cyclic1 = {};
            var cyclic2 = {};
            cyclic1.ref = {
                ref: cyclic1
            };
            cyclic2.ref = {};
            cyclic2.ref.ref = cyclic2.ref;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isTrue(checkDeep);
        });

        it("returns false if referencing different and unequal cyclic objects", function() {
            var cyclic1 = { a: "a" };
            var cyclic2 = { a: "a" };
            cyclic1.ref = {
                b: "b",
                ref: cyclic1
            };
            cyclic2.ref = {
                b: "b"
            };
            cyclic2.ref.ref = cyclic2.ref;
            var checkDeep = samsam.deepEqual(cyclic1, cyclic2);
            assert.isFalse(checkDeep);
        });
    });
});
