"use strict";

const matcherPrototype = {
    toString() {
        return this.message;
    },
};

matcherPrototype.or = function (valueOrMatcher) {
    const createMatcher = require("../create-matcher");
    const isMatcher = createMatcher.isMatcher;

    if (!arguments.length) {
        throw new TypeError("Matcher expected");
    }

    const m2 = isMatcher(valueOrMatcher)
        ? valueOrMatcher
        : createMatcher(valueOrMatcher);
    const m1 = this;
    const or = Object.create(matcherPrototype);
    or.test = function (actual) {
        return m1.test(actual) || m2.test(actual);
    };
    or.message = `${m1.message}.or(${m2.message})`;
    return or;
};

matcherPrototype.and = function (valueOrMatcher) {
    const createMatcher = require("../create-matcher");
    const isMatcher = createMatcher.isMatcher;

    if (!arguments.length) {
        throw new TypeError("Matcher expected");
    }

    const m2 = isMatcher(valueOrMatcher)
        ? valueOrMatcher
        : createMatcher(valueOrMatcher);
    const m1 = this;
    const and = Object.create(matcherPrototype);
    and.test = function (actual) {
        return m1.test(actual) && m2.test(actual);
    };
    and.message = `${m1.message}.and(${m2.message})`;
    return and;
};

module.exports = matcherPrototype;
