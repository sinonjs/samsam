"use strict";

const assert = require("@sinonjs/referee").assert;
const forEach = require("@sinonjs/commons").prototypes.array.forEach;
const functionName = require("@sinonjs/commons").functionName;

const ARRAY_TYPES = require("./array-types");
const isArrayType = require("./is-array-type");

describe("isArrayType", function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    forEach(ARRAY_TYPES, (ArrayType) => {
        // eslint-disable-next-line mocha/no-setup-in-describe
        context(`given ${functionName(ArrayType)}`, function () {
            it("returns true", function () {
                assert.isTrue(isArrayType(new ArrayType([])));
            });
        });
    });

    context("given other types", function () {
        it("returns false", function () {
            assert.isFalse(isArrayType(null));
            assert.isFalse(isArrayType("string"));
            assert.isFalse(isArrayType(42));
            assert.isFalse(isArrayType({}));
            assert.isFalse(isArrayType(/sinon/));
        });
    });
});
