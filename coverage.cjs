"use strict";

const esbuild = require("esbuild");

(async function () {
    const { default: getStdin } = await import("get-stdin");
    const stdin = {
        contents: await getStdin(),
        resolveDir: process.cwd(),
        sourcefile: "tests.js",
        loader: "js",
    };

    const context = await esbuild.context({
        absWorkingDir: process.cwd(),
        entryPoints: [],
        write: false,
        bundle: true,
        sourcemap: "inline",
        sourcesContent: true,
        define: {
            global: "window",
        },
        external: ["fs"],
        target: "es2022",
        color: true,
        stdin,
    });

    const { outputFiles } = await context.rebuild();
    const js = outputFiles[0].text;

    context.dispose();

    process.stdout.write(js);
})();
