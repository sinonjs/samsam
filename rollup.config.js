"use strict";

var commonjs = require("rollup-plugin-commonjs");

module.exports = {
    entry: "lib/samsam.js",
    exports: "named",
    format: "umd",
    moduleName: "samsam",
    plugins: [commonjs({ sourceMap: false })]
};
