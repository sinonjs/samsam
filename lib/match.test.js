"use strict";

const assert = require("@sinonjs/referee").assert;
const forEach = require("@sinonjs/commons").prototypes.array.forEach;
const functionName = require("@sinonjs/commons").functionName;
const createSet = require("./create-set");
const engineCanCompareMaps = typeof Array.from === "function";
const samsam = require("./samsam");
const ARRAY_TYPES = require("./array-types");

describe("match", function () {
    it("returns true if matching regexp", function () {
        const checkMatch = samsam.match("Assertions", /[a-z]/);
        assert.isTrue(checkMatch);
    });

    it("returns true if generic object and test method returning true", function () {
        const checkMatch = samsam.match("Assertions", {
            test() {
                return true;
            },
        });
        assert.isTrue(checkMatch);
    });

    it("returns false if non matching regexp", function () {
        const checkMatch = samsam.match("Assertions 123", /^[a-z]$/);
        assert.isFalse(checkMatch);
    });

    it("returns true if matching booleans", function () {
        const checkMatch = samsam.match(true, true);
        assert.isTrue(checkMatch);
    });

    it("returns false if mismatching booleans", function () {
        const checkMatch = samsam.match(true, false);
        assert.isFalse(checkMatch);
    });

    it("returns false if generic object with test method returning false", function () {
        const checkMatch = samsam.match("Assertions", {
            test() {
                return false;
            },
        });
        assert.isFalse(checkMatch);
    });

    it("returns false if match object === null", function () {
        const checkMatch = samsam.match("Assertions 123", null);
        assert.isFalse(checkMatch);
    });

    it("returns false if match object === false", function () {
        const checkMatch = samsam.match("Assertions 123", false);
        assert.isFalse(checkMatch);
    });

    it("returns false if matching number against string", function () {
        const checkMatch = samsam.match("Assertions", 23);
        assert.isFalse(checkMatch);
    });

    it("returns false if matching number against similar string", function () {
        const checkMatch = samsam.match("23", 23);
        assert.isFalse(checkMatch);
    });

    it("returns true if matching number against itself", function () {
        const checkMatch = samsam.match(23, 23);
        assert.isTrue(checkMatch);
    });

    it("returns true if matcher function returns true", function () {
        const checkMatch = samsam.match("Assertions 123", () => true);
        assert.isTrue(checkMatch);
    });

    it("returns false if matcher function returns false", function () {
        const checkMatch = samsam.match("Assertions 123", () => false);
        assert.isFalse(checkMatch);
    });

    it("returns false if matcher function returns falsy", function () {
        // eslint-disable-next-line no-empty-function
        const checkMatch = samsam.match("Assertions 123", () => {});
        assert.isFalse(checkMatch);
    });

    it("returns false if matcher does not return explicit true", function () {
        const checkMatch = samsam.match("Assertions 123", () => "Hey");
        assert.isFalse(checkMatch);
    });

    it("returns true if matcher is substring of matchee", function () {
        const checkMatch = samsam.match("Diskord", "or");
        assert.isTrue(checkMatch);
    });

    it("returns true if matcher is string equal to matchee", function () {
        const checkMatch = samsam.match("Diskord", "Diskord");
        assert.isTrue(checkMatch);
    });

    it("returns true if matcher is strings ignoring case", function () {
        const checkMatch = samsam.match(
            "Look ma, case-insensitive",
            "LoOk Ma, CaSe-InSenSiTiVe",
        );
        assert.isTrue(checkMatch);
    });

    it("returns false if match string is not substring of matchee", function () {
        const checkMatch = samsam.match("Vim", "Emacs");
        assert.isFalse(checkMatch);
    });

    it("returns false if match string is not substring of object", function () {
        const checkMatch = samsam.match({}, "Emacs");
        assert.isFalse(checkMatch);
    });

    it("returns false if matcher is not substring of object.toString", function () {
        const checkMatch = samsam.match(
            {
                toString() {
                    return "Vim";
                },
            },
            "Emacs",
        );
        assert.isFalse(checkMatch);
    });

    it("returns false if null and empty string", function () {
        const checkMatch = samsam.match(null, "");
        assert.isFalse(checkMatch);
    });

    it("returns false if null and empty object", function () {
        const checkMatch = samsam.match(null, {});
        assert.isFalse(checkMatch);
    });

    it("returns false if null and object with properties", function () {
        const checkMatch = samsam.match(null, { not: 1 });
        assert.isFalse(checkMatch);
    });

    it("returns false if undefined and empty string", function () {
        const checkMatch = samsam.match(undefined, "");
        assert.isFalse(checkMatch);
    });

    it("returns false if undefined and empty object", function () {
        const checkMatch = samsam.match(undefined, {});
        assert.isFalse(checkMatch);
    });

    it("returns false if false and empty string", function () {
        const checkMatch = samsam.match(false, "");
        assert.isFalse(checkMatch);
    });

    it("returns false if false and empty object", function () {
        const checkMatch = samsam.match(false, {});
        assert.isFalse(checkMatch);
    });

    it("returns false if 0 and empty string", function () {
        const checkMatch = samsam.match(0, "");
        assert.isFalse(checkMatch);
    });

    it("returns false if 0 and empty object", function () {
        const checkMatch = samsam.match(0, {});
        assert.isFalse(checkMatch);
    });

    it("returns false if NaN and empty string", function () {
        const checkMatch = samsam.match(NaN, "");
        assert.isFalse(checkMatch);
    });

    it("returns false if NaN and empty object", function () {
        const checkMatch = samsam.match(NaN, {});
        assert.isFalse(checkMatch);
    });

    it("returns true if object containing all properties in matcher", function () {
        const object = {
            id: 42,
            name: "Christian",
            doIt: "yes",

            speak() {
                return this.name;
            },
        };
        const checkMatch = samsam.match(object, {
            id: 42,
            doIt: "yes",
        });
        assert.isTrue(checkMatch);
    });

    it("returns false if nested array has more properties", function () {
        const object = {
            nested: [1, 2, 3],
        };
        const checkMatch = samsam.match(object, {
            nested: [2],
        });
        assert.isFalse(checkMatch);
    });

    it("returns true if nested matcher", function () {
        const object = {
            id: 42,
            name: "Christian",
            doIt: "yes",
            owner: {
                someDude: "Yes",
                hello: "ok",
            },

            speak() {
                return this.name;
            },
        };
        const checkMatch = samsam.match(object, {
            owner: {
                someDude: "Yes",
                hello: samsam.createMatcher((value) => value === "ok"),
            },
        });
        assert.isTrue(checkMatch);
    });

    it("returns true if empty strings", function () {
        const checkMatch = samsam.match("", "");
        assert.isTrue(checkMatch);
    });

    it("returns true if empty strings as object properties", function () {
        const checkMatch = samsam.match({ foo: "" }, { foo: "" });
        assert.isTrue(checkMatch);
    });

    describe("arrays", function () {
        function instantiate(Klass) {
            return function (value) {
                return new Klass(value);
            };
        }
        // eslint-disable-next-line mocha/no-setup-in-describe
        forEach(ARRAY_TYPES, function (value) {
            before(function () {
                if (typeof value === "undefined") {
                    this.skip();
                }
            });

            const createArray = instantiate(value);

            // eslint-disable-next-line mocha/no-setup-in-describe
            describe(functionName(value), function () {
                it("returns true if similar arrays", function () {
                    const checkMatch = samsam.match(
                        createArray([1, 2, 3]),
                        createArray([1, 2, 3]),
                    );
                    assert.isTrue(checkMatch);
                });

                it("returns true if array subset", function () {
                    const checkMatch = samsam.match(
                        createArray([1, 2, 3]),
                        createArray([2, 3]),
                    );
                    assert.isTrue(checkMatch);
                });

                it("returns true if single-element array subset", function () {
                    const checkMatch = samsam.match(
                        createArray([1, 2, 3]),
                        createArray([1]),
                    );
                    assert.isTrue(checkMatch);
                });

                it("returns false if subset array does not include a match", function () {
                    const checkMatch = samsam.match(
                        createArray([1, 2, 3]),
                        createArray([4]),
                    );
                    assert.isFalse(checkMatch);
                });

                it("returns false if mis-matching array 'subset'", function () {
                    const checkMatch = samsam.match(
                        createArray([1, 2, 3]),
                        createArray([2, 3, 4]),
                    );
                    assert.isFalse(checkMatch);
                });

                it("returns false if mis-ordered array 'subset'", function () {
                    const checkMatch = samsam.match(
                        createArray([1, 2, 3]),
                        createArray([1, 3]),
                    );
                    assert.isFalse(checkMatch);
                });

                it("returns true if empty arrays", function () {
                    const checkMatch = samsam.match(
                        createArray([]),
                        createArray([]),
                    );
                    assert.isTrue(checkMatch);
                });

                it("returns false if subset length is more than array length", function () {
                    const checkMatch = samsam.match(
                        createArray([]),
                        createArray([0]),
                    );
                    assert.isFalse(checkMatch);
                });
            });
        });

        describe("with complex content", function () {
            it("returns true if matching array subset", function () {
                const checkMatch = samsam.match(
                    [1, 2, 3, { id: 42 }],
                    [{ id: 42 }],
                );
                assert.isTrue(checkMatch);
            });

            it("returns false if mis-ordered, but similar arrays of objects", function () {
                const checkMatch = samsam.match(
                    [{ a: "a" }, { a: "aa" }],
                    [{ a: "aa" }, { a: "a" }],
                );
                assert.isFalse(checkMatch);
            });
        });
    });

    it("returns true if objects with empty arrays", function () {
        const checkMatch = samsam.match({ xs: [] }, { xs: [] });
        assert.isTrue(checkMatch);
    });

    it("returns false if nested objects with different depth", function () {
        const checkMatch = samsam.match({ a: 1 }, { b: { c: 2 } });
        assert.isFalse(checkMatch);
    });

    it("returns true if dom elements with matching data attributes", function () {
        const checkMatch = samsam.match(
            {
                getAttribute(name) {
                    if (name === "data-path") {
                        return "foo.bar";
                    }
                    return false;
                },
            },
            { "data-path": "foo.bar" },
        );
        assert.isTrue(checkMatch);
    });

    it("returns false if dom elements with not matching data attributes", function () {
        const checkMatch = samsam.match(
            {
                getAttribute(name) {
                    if (name === "data-path") {
                        return "foo.foo";
                    }
                    return false;
                },
            },
            { "data-path": "foo.bar" },
        );
        assert.isFalse(checkMatch);
    });

    it("returns true if equal null properties", function () {
        const checkMatch = samsam.match({ foo: null }, { foo: null });
        assert.isTrue(checkMatch);
    });

    it("returns false if unmatched null property", function () {
        const checkMatch = samsam.match({}, { foo: null });
        assert.isFalse(checkMatch);
    });

    it("returns false if matcher with unmatched null property", function () {
        const checkMatch = samsam.match({ foo: "arbitrary" }, { foo: null });
        assert.isFalse(checkMatch);
    });

    it("returns true if equal undefined properties", function () {
        const checkMatch = samsam.match({ foo: undefined }, { foo: undefined });
        assert.isTrue(checkMatch);
    });

    it("returns false if matcher with unmatched undefined property", function () {
        const checkMatch = samsam.match(
            { foo: "arbitrary" },
            { foo: undefined },
        );
        assert.isFalse(checkMatch);
    });

    it("returns true if unmatched undefined property", function () {
        const checkMatch = samsam.match({}, { foo: undefined });
        assert.isTrue(checkMatch);
    });

    it("returns true if same object matches self", function () {
        const obj = { foo: undefined };
        const checkMatch = samsam.match(obj, obj);
        assert.isTrue(checkMatch);
    });

    it("returns true if null to null", function () {
        const checkMatch = samsam.match(null, null);
        assert.isTrue(checkMatch);
    });

    it("returns false if null to undefined", function () {
        const checkMatch = samsam.match(null, undefined);
        assert.isFalse(checkMatch);
    });

    it("returns true if undefined to undefined", function () {
        const checkMatch = samsam.match(undefined, undefined);
        assert.isTrue(checkMatch);
    });

    it("returns false if undefined to null", function () {
        const checkMatch = samsam.match(undefined, null);
        assert.isFalse(checkMatch);
    });

    it("returns true if date objects with same date", function () {
        const date = new Date();
        const sameDate = new Date(date.getTime());
        const checkMatch = samsam.match(date, sameDate);
        assert.isTrue(checkMatch);
    });

    it("returns false if date objects with different dates", function () {
        const date = new Date();
        const anotherDate = new Date(date.getTime() - 10);
        const checkMatch = samsam.match(date, anotherDate);
        assert.isFalse(checkMatch);
    });

    if (typeof Set !== "undefined") {
        it("returns true if sets with same content", function () {
            const checkMatch = samsam.match(
                createSet([1, 2, 3]),
                createSet([2, 1, 3]),
            );

            assert.isTrue(checkMatch);
        });

        it("returns true if subsets", function () {
            const checkMatch = samsam.match(
                createSet([1, 2, 3]),
                createSet([3, 1]),
            );

            assert.isTrue(checkMatch);
        });

        it("returns true if subset complex types", function () {
            const checkMatch = samsam.match(
                createSet([1, { id: 42 }, 3]),
                createSet([{ id: 42 }]),
            );

            assert.isTrue(checkMatch);
        });

        it("returns false if sets with dissimilar content", function () {
            const checkMatch = samsam.match(
                createSet([1, 2, 3]),
                createSet([2, 5, 1]),
            );

            assert.isFalse(checkMatch);
        });

        it("returns false if sets with different complex member", function () {
            const checkMatch = samsam.match(
                createSet([{ id: 42 }]),
                createSet([{ id: 13 }]),
            );

            assert.isFalse(checkMatch);
        });

        it("returns true if differently sorted complex objects", function () {
            const set1 = createSet([
                {
                    end: "2019-08-07T18:00:00Z",
                    geoAvailability: {
                        resId: "http://id.nrk.no/2015/guri/IPRights/geoavailability/NORGE",
                        title: "NORGE",
                    },
                    resId: "http://id.nrk.no/2015/guri/68cc0a15-2be1-4666-984f-b421b415326d/publicationEvent/0",
                    start: "2015-04-03T14:00:00Z",
                },
                {
                    geoAvailability: {
                        resId: "http://id.nrk.no/2015/guri/IPRights/geoavailability/NRK",
                        title: "NRK",
                    },
                    resId: "x-test:pubEvent-1",
                    start: "2015-04-03T14:00:00Z",
                },
            ]);
            const set2 = createSet([
                {
                    geoAvailability: {
                        resId: "http://id.nrk.no/2015/guri/IPRights/geoavailability/NRK",
                        title: "NRK",
                    },
                    resId: "x-test:pubEvent-1",
                    start: "2015-04-03T14:00:00Z",
                },
                {
                    end: "2019-08-07T18:00:00Z",
                    geoAvailability: {
                        resId: "http://id.nrk.no/2015/guri/IPRights/geoavailability/NORGE",
                        title: "NORGE",
                    },
                    start: "2015-04-03T14:00:00Z",
                },
            ]);
            const checkMatch = samsam.match(set1, set2);
            assert.isTrue(checkMatch);
        });

        it("returns false on set compared with something else", function () {
            assert.isFalse(samsam.match(createSet([1, 2, 3]), "string"));
            assert.isFalse(samsam.match(createSet([1, 2, 3]), false));
            assert.isFalse(samsam.match(createSet([1, 2, 3]), true));
            assert.isFalse(samsam.match(createSet([1, 2, 3]), 123));
        });
    }

    describe("Map", function () {
        context("when engine cannot compare Map instances", function () {
            before(function () {
                if (engineCanCompareMaps) {
                    this.skip();
                }
            });

            it("throws an error", function () {
                const map1 = new Map();
                const map2 = new Map();

                map1.set(42, "sinon");
                map2.set(42, "sinon");

                assert.exception(() => {
                    samsam.match(map1, map2);
                }, /The JavaScript engine does not support Array.from and cannot reliably do value comparison of Map instances/);
            });
        });

        context("when engine can compare Map instances", function () {
            before(function () {
                if (!engineCanCompareMaps) {
                    this.skip();
                }
            });

            it("returns true for same content in map", function () {
                const map1 = new Map();
                const map2 = new Map();

                map1.set(42, "sinon");
                map2.set(42, "sinon");

                assert.isTrue(samsam.match(map1, map2));
            });

            it("returns true for same complex content in map", function () {
                const map1 = new Map();
                const map2 = new Map();

                map1.set({ foo: "bar" }, "sinon");
                map2.set({ foo: "bar" }, "sinon");

                assert.isTrue(samsam.match(map1, map2));
            });

            it("returns true for a supset of map", function () {
                const map1 = new Map();
                const map2 = new Map();

                map1.set(42, "sinon");
                map1.set({ foo: "bar" }, "sinon");
                map2.set({ foo: "bar" }, "sinon");

                assert.isTrue(samsam.match(map1, map2));
            });

            it("returns false for content in different order", function () {
                const map1 = new Map();
                const map2 = new Map();

                map1.set(42, "sinon");
                map1.set("foo", "bar");

                map2.set("foo", "bar");
                map2.set(42, "sinon");

                assert.isFalse(samsam.match(map1, map2));
            });

            it("returns false for maps with dissimilar content", function () {
                const map1 = new Map();
                const map2 = new Map();

                map1.set(42, "sinon");
                map2.set("sinon", 42);

                assert.isFalse(samsam.match(map1, map2));
            });

            it("returns false if the subset has more entries", function () {
                const map1 = new Map();
                const map2 = new Map();

                map1.set({ foo: "bar" }, "sinon");
                map2.set(42, "sinon");
                map2.set({ foo: "bar" }, "sinon");

                assert.isFalse(samsam.match(map1, map2));
            });

            it("returns false on map compared with something else", function () {
                const map = new Map();

                map.set(42, "sinon");
                map.set("foo", "bar");

                assert.isFalse(samsam.match(map, "string"));
                assert.isFalse(samsam.match(map, true));
                assert.isFalse(samsam.match(map, false));
                assert.isFalse(samsam.match(map, 123));
            });
        });
    });

    describe("BigInt", function () {
        before(function () {
            if (typeof BigInt === "undefined") {
                this.skip();
            }
        });

        it("returns true if comparing the same value", function () {
            assert.isTrue(samsam.match(BigInt(1), BigInt(1)));
        });

        it("returns false if comparing different values", function () {
            assert.isFalse(samsam.match(BigInt(1), BigInt(-1)));
        });

        it("returns false if comparing BigInt with a value of another type", function () {
            assert.isFalse(samsam.match(BigInt(1), 1));
        });
    });

    describe("symbol", function () {
        before(function () {
            if (typeof Symbol === "undefined") {
                this.skip();
            }
        });

        it("returns true if comparing the same symbol", function () {
            const symbol = Symbol("foo");
            const checkMatch = samsam.match(symbol, symbol);
            assert.isTrue(checkMatch);
        });

        it("returns false if comparing two differnt symbols", function () {
            const checkMatch = samsam.match(Symbol("foo"), Symbol("bar"));
            assert.isFalse(checkMatch);
        });

        it("returns false if two symbols with the same value", function () {
            const value = "foo";
            const checkMatch = samsam.match(Symbol(value), Symbol(value));
            assert.isFalse(checkMatch);
        });
    });
});
