"use strict";

var commonjs = require("rollup-plugin-commonjs");

module.exports = {
    input: "lib/samsam.js",
    output: {
        inlineDynamicImports: true,
        file: "dist/samsam.js",
        exports: "named",
        format: "umd",
        name: "samsam"
    },
    plugins: [commonjs({ sourceMap: false })]
};
