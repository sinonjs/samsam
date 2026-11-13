"use strict";

const functionName = require("@sinonjs/commons").functionName;
const join = require("@sinonjs/commons").prototypes.array.join;
const map = require("@sinonjs/commons").prototypes.array.map;
const stringIndexOf = require("@sinonjs/commons").prototypes.string.indexOf;
const valueToString = require("@sinonjs/commons").valueToString;

const matchObject = require("./match-object");

const createTypeMap = function (match) {
    return {
        function(m, expectation, message) {
            m.test = expectation;
            m.message = message || `match(${functionName(expectation)})`;
        },
        number(m, expectation) {
            m.test = function (actual) {
                // we need type coercion here
                return expectation == actual; // eslint-disable-line eqeqeq
            };
        },
        object(m, expectation) {
            let array = [];

            if (typeof expectation.test === "function") {
                m.test = function (actual) {
                    return expectation.test(actual) === true;
                };
                m.message = `match(${functionName(expectation.test)})`;
                return m;
            }

            array = map(
                Object.keys(expectation),
                (key) => `${key}: ${valueToString(expectation[key])}`,
            );

            m.test = function (actual) {
                return matchObject(actual, expectation, match);
            };
            m.message = `match(${join(array, ", ")})`;

            return m;
        },
        regexp(m, expectation) {
            m.test = function (actual) {
                return typeof actual === "string" && expectation.test(actual);
            };
        },
        string(m, expectation) {
            m.test = function (actual) {
                return (
                    typeof actual === "string" &&
                    stringIndexOf(actual, expectation) !== -1
                );
            };
            m.message = `match("${expectation}")`;
        },
    };
};

module.exports = createTypeMap;
