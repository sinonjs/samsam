"use strict";

const assert = require("@sinonjs/referee").assert;
const iterableToString = require("./iterable-to-string");

describe("iterableToString", function () {
    it("returns an String representation of Array objects", function () {
        const arr = [1, "one", true, undefined, null];
        const expected = "1,'one',true,undefined,null";

        assert.equals(iterableToString(arr), expected);
    });

    if (typeof Map === "function") {
        it("returns an String representation of Map objects", function () {
            const map = new Map();
            map.set(1, 1);
            map.set("one", "one");
            map.set(true, true);
            map.set(undefined, undefined);
            map.set(null, null);
            const expected =
                "[1,1]," +
                "['one','one']," +
                "[true,true]," +
                "[undefined,undefined]," +
                "[null,null]";

            assert.equals(iterableToString(map), expected);
        });
    }

    if (typeof Set === "function") {
        it("returns an String representation of Set objects", function () {
            const set = new Set();
            set.add(1);
            set.add("one");
            set.add(true);
            set.add(undefined);
            set.add(null);

            const expected = "1,'one',true,undefined,null";

            assert.equals(iterableToString(set), expected);
        });
    }
});
