/*eslint-env mocha*/
/*
 * Global beforeEach and afterEach hooks for Mocha to verify that each test has
 * at least one referee assertion.
 *
 * Preload with `mocha --file ./fixture/verifier.js`.
 */
"use strict";

var referee = require("@sinonjs/referee");

var verify;

beforeEach(function() {
    verify = referee.verifier();
});

afterEach(function() {
    /*
     * Only verify assertions if the current test is not already failing.
     * Otherwise a thrown exception in the test case causes two errors, one for
     * the exception and one for the missing assertions.
     */
    if (!this.currentTest.err) {
        try {
            verify();
        } catch (e) {
            /*
             * Catch the error and report it programatically to continue
             * running tests. Otherwise Mocha bails and the remaining test
             * cases are not executed.
             */
            this.test.error(e);
        }
    }
});
