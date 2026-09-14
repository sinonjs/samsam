"use strict";
const assert = require("node:assert");

assert(process.env.BROWSER_NAME);

// Runs the tests against a WebDriver server on localhost
module.exports = {
    driver: "webdriver",
    // Serve the tests over http instead of loading them from a local file,
    // because Microsoft Edge has no sessionStorage on pages loaded from a file.
    serve: ".",
    // eslint-disable-next-line camelcase
    driver_options: {
        hostname: "localhost",
        port: Number(process.env.WEBDRIVER_PORT || 4444),
        path: "/",
        capabilities: {
            browserName: process.env.BROWSER_NAME,
        },
    },
};
