"use strict";

const noPrototypeMethods = require("@sinonjs/eslint-plugin-no-prototype-methods");
const sinonConfig = require("@sinonjs/eslint-config");

module.exports = [
    {
        ignores: ["eslint.config.js", "test/*-test.js"],
    },
    ...sinonConfig,
    {
        plugins: {
            "@sinonjs/no-prototype-methods": noPrototypeMethods,
        },
        rules: {
            "@sinonjs/no-prototype-methods/no-prototype-methods": "error",
        },
    },
    {
        files: ["**/*.test.*"],
        rules: {
            "@sinonjs/no-prototype-methods/no-prototype-methods": "off",
        },
    },
];
