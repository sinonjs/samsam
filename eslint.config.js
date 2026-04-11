"use strict";

const noPrototypeMethods = require("@sinonjs/eslint-plugin-no-prototype-methods");
const sinonConfig = require("@sinonjs/eslint-config");

module.exports = [
    {
        ignores: [
            "eslint.config.js",
            "coverage/**",
            "dist/**",
            "test/*-test.js",
            "site/**",
            "out/**",
        ],
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
        languageOptions: {
            globals: {
                Float32Array: false,
                Float64Array: false,
                Int8Array: false,
                Int16Array: false,
                Int32Array: false,
                Map: false,
                Promise: false,
                Set: false,
                Symbol: false,
                Uint8Array: false,
                Uint16Array: false,
                Uint32Array: false,
                Uint8ClampedArray: false,
                WeakMap: false,
                WeakSet: false,
            },
        },
        rules: {
            "max-len": "off",
            quotes: "off",
        },
    },
    {
        files: ["**/*.test.*"],
        rules: {
            "@sinonjs/no-prototype-methods/no-prototype-methods": "off",
        },
    },
];
