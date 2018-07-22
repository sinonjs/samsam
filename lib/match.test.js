"use strict";

var assert = require("@sinonjs/referee").assert;
var samsam = require("./samsam");

describe("match", function () {
    it("returns true if matching regexp", function () {
        var checkMatch = samsam.match("Assertions", /[a-z]/);
        assert.isTrue(checkMatch);
    });

    it("returns true if generic object and test method returning true", function () {
        var checkMatch = samsam.match("Assertions", {
            test: function () { return true; }
        });
        assert.isTrue(checkMatch);
    });

    it("returns false if non matching regexp", function () {
        var checkMatch = samsam.match("Assertions 123", /^[a-z]$/);
        assert.isFalse(checkMatch);
    });

    it("returns true if matching booleans", function () {
        var checkMatch = samsam.match(true, true);
        assert.isTrue(checkMatch);
    });

    it("returns false if mismatching booleans", function () {
        var checkMatch = samsam.match(true, false);
        assert.isFalse(checkMatch);
    });

    it("returns false if generic object with test method returning false", function () {
        var checkMatch = samsam.match("Assertions", { test: function () { return false; } });
        assert.isFalse(checkMatch);
    });

    it("should throw error if match object === null", function () {
        var checkMatch = samsam.match("Assertions 123", null);
        assert.isFalse(checkMatch);
    });

    it("returns false if match object === false", function () {
        var checkMatch = samsam.match("Assertions 123", false);
        assert.isFalse(checkMatch);
    });

    it("returns false if matching number against string", function () {
        var checkMatch = samsam.match("Assertions", 23);
        assert.isFalse(checkMatch);
    });

    it("returns false if matching number against similar string", function () {
        var checkMatch = samsam.match("23", 23);
        assert.isFalse(checkMatch);
    });

    it("returns true if matching number against itself", function () {
        var checkMatch = samsam.match(23, 23);
        assert.isTrue(checkMatch);
    });

    it("returns true if matcher function returns true", function () {
        var checkMatch = samsam.match("Assertions 123", function () { return true; });
        assert.isTrue(checkMatch);
    });

    it("returns false if matcher function returns false", function () {
        var checkMatch = samsam.match("Assertions 123", function () { return false; });
        assert.isFalse(checkMatch);
    });

    it("returns false if matcher function returns falsy", function () {
        var checkMatch = samsam.match("Assertions 123", function () { });
        assert.isFalse(checkMatch);
    });

    it("returns false if matcher does not return explicit true", function () {
        var checkMatch = samsam.match("Assertions 123", function () { return "Hey"; });
        assert.isFalse(checkMatch);
    });

    it("returns true if matcher is substring of matchee", function () {
        var checkMatch = samsam.match("Diskord", "or");
        assert.isTrue(checkMatch);
    });

    it("returns true if matcher is string equal to matchee", function () {
        var checkMatch = samsam.match("Diskord", "Diskord");
        assert.isTrue(checkMatch);
    });

    it("returns true if matcher is strings ignoring case", function () {
        var checkMatch = samsam.match("Look ma, case-insensitive",
            "LoOk Ma, CaSe-InSenSiTiVe");
        assert.isTrue(checkMatch);
    });

    it("returns false if match string is not substring of matchee", function () {
        var checkMatch = samsam.match("Vim", "Emacs");
        assert.isFalse(checkMatch);
    });

    it("returns false if match string is not substring of object", function () {
        var checkMatch = samsam.match({}, "Emacs");
        assert.isFalse(checkMatch);
    });

    it("returns false if matcher is not substring of object.toString", function () {
        var checkMatch = samsam.match({
            toString: function () { return "Vim"; }
        }, "Emacs");
        assert.isFalse(checkMatch);
    });

    it("returns false if null and empty string", function () {
        var checkMatch = samsam.match(null, "");
        assert.isFalse(checkMatch);
    });

    it("returns false if undefined and empty string", function () {
        var checkMatch = samsam.match(undefined, "");
        assert.isFalse(checkMatch);
    });

    it("returns false if false and empty string", function () {
        var checkMatch = samsam.match(false, "");
        assert.isFalse(checkMatch);
    });

    it("returns false if 0 and empty string", function () {
        var checkMatch = samsam.match(0, "");
        assert.isFalse(checkMatch);
    });

    it("returns false if NaN and empty string", function () {
        var checkMatch = samsam.match(NaN, "");
        assert.isFalse(checkMatch);
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
        assert.isTrue(checkMatch);
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
        assert.isTrue(checkMatch);
    });

    it("returns true if empty strings", function () {
        var checkMatch = samsam.match("", "");
        assert.isTrue(checkMatch);
    });

    it("returns true if empty strings as object properties", function () {
        var checkMatch = samsam.match({ foo: "" }, { foo: "" });
        assert.isTrue(checkMatch);
    });

    it("returns true if similar arrays", function () {
        var checkMatch = samsam.match([1, 2, 3], [1, 2, 3]);
        assert.isTrue(checkMatch);
    });

    it("returns true if array subset", function () {
        var checkMatch = samsam.match([1, 2, 3], [2, 3]);
        assert.isTrue(checkMatch);
    });

    it("returns true if single-element array subset", function () {
        var checkMatch = samsam.match([1, 2, 3], [1]);
        assert.isTrue(checkMatch);
    });

    it("returns true if matching array subset", function () {
        var checkMatch = samsam.match([1, 2, 3, { id: 42 }], [{ id: 42 }]);
        assert.isTrue(checkMatch);
    });

    it("returns false if mis-matching array 'subset'", function () {
        var checkMatch = samsam.match([1, 2, 3], [2, 3, 4]);
        assert.isFalse(checkMatch);
    });

    it("returns false if mis-ordered array 'subset'", function () {
        var checkMatch = samsam.match([1, 2, 3], [1, 3]);
        assert.isFalse(checkMatch);
    });

    it("returns false if mis-ordered, but similar arrays of objects", function () {
        var checkMatch = samsam.match([{a: "a"}, {a: "aa"}], [{a: "aa"}, {a: "a"}]);
        assert.isFalse(checkMatch);
    });

    it("returns true if empty arrays", function () {
        var checkMatch = samsam.match([], []);
        assert.isTrue(checkMatch);
    });

    it("returns true if objects with empty arrays", function () {
        var checkMatch = samsam.match({ xs: [] }, { xs: [] });
        assert.isTrue(checkMatch);
    });

    it("returns false if nested objects with different depth", function () {
        var checkMatch = samsam.match({ a: 1 }, { b: { c: 2 } });
        assert.isFalse(checkMatch);
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
        assert.isTrue(checkMatch);
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
        assert.isFalse(checkMatch);
    });

    it("returns true if equal null properties", function () {
        var checkMatch = samsam.match({ foo: null }, { foo: null });
        assert.isTrue(checkMatch);
    });

    it("returns false if unmatched null property", function () {
        var checkMatch = samsam.match({}, { foo: null });
        assert.isFalse(checkMatch);
    });

    it("returns false if matcher with unmatched null property", function () {
        var checkMatch = samsam.match({ foo: "arbitrary" }, { foo: null });
        assert.isFalse(checkMatch);
    });

    it("returns true if equal undefined properties", function () {
        var checkMatch = samsam.match({ foo: undefined }, { foo: undefined });
        assert.isTrue(checkMatch);
    });

    it("returns false if matcher with unmatched undefined property", function () {
        var checkMatch = samsam.match({ foo: "arbitrary" }, { foo: undefined });
        assert.isFalse(checkMatch);
    });

    it("returns true if unmatched undefined property", function () {
        var checkMatch = samsam.match({}, { foo: undefined });
        assert.isTrue(checkMatch);
    });

    it("returns true if same object matches self", function () {
        var obj = { foo: undefined };
        var checkMatch = samsam.match(obj, obj);
        assert.isTrue(checkMatch);
    });

    it("returns true if null to null", function () {
        var checkMatch = samsam.match(null, null);
        assert.isTrue(checkMatch);
    });

    it("returns false if null to undefined", function () {
        var checkMatch = samsam.match(null, undefined);
        assert.isFalse(checkMatch);
    });

    it("returns true if undefined to undefined", function () {
        var checkMatch = samsam.match(undefined, undefined);
        assert.isTrue(checkMatch);
    });

    it("returns false if undefined to null", function () {
        var checkMatch = samsam.match(undefined, null);
        assert.isFalse(checkMatch);
    });

    it("returns true if date objects with same date", function () {
        var date = new Date();
        var sameDate = new Date(date.getTime());
        var checkMatch = samsam.match(date, sameDate);
        assert.isTrue(checkMatch);
    });

    it("returns false if date objects with different dates", function () {
        var date = new Date();
        var anotherDate = new Date(date.getTime() - 10);
        var checkMatch = samsam.match(date, anotherDate);
        assert.isFalse(checkMatch);
    });

    if (typeof Set !== "undefined") {
        it("returns true if sets with same content", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, 2, 3]), new Set([2, 3, 1]));
            assert.isTrue(checkMatch);
        });

        it("returns true if subsets", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, 2, 3]), new Set([3, 1]));
            assert.isTrue(checkMatch);
        });

        it("returns true if subset complex types", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, {id: 42}, 3]), new Set([{id: 42}]));
            assert.isTrue(checkMatch);
        });

        it("returns false if sets with dissimilar content", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([1, 2, 3]), new Set([2, 5, 1]));
            assert.isFalse(checkMatch);
        });

        it("returns false if sets with different complex member", function () {
            // eslint-disable-next-line ie11/no-collection-args
            var checkMatch = samsam.match(new Set([{id: 42}]), new Set([{id: 13}]));
            assert.isFalse(checkMatch);
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
            assert.isTrue(checkMatch);
        });

        it("returns false on set compared with something else", function () {
            // eslint-disable-next-line ie11/no-collection-args
            assert.isFalse(samsam.match(new Set([1, 2, 3]), "string"));
            // eslint-disable-next-line ie11/no-collection-args
            assert.isFalse(samsam.match(new Set([1, 2, 3]), false));
            // eslint-disable-next-line ie11/no-collection-args
            assert.isFalse(samsam.match(new Set([1, 2, 3]), true));
            // eslint-disable-next-line ie11/no-collection-args
            assert.isFalse(samsam.match(new Set([1, 2, 3]), 123));
        });
    }
});
