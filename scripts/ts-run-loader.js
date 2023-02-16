/*
An ESM loader for node which adds typescript support.

Usually you'd use ts-node for situations where typescript compilation at
runtime is required. Unfortunately ts-node does not support native ESM
and typescript path alias (which we use to define "@" as the project root
in import paths). See https://github.com/TypeStrong/ts-node/discussions/1450
and https://github.com/TypeStrong/ts-node/pull/1585

This file enables a workaround and we will thankfully be able to get rid of it
once the issue referred to above is resolved. Until then this file can be used
as a loader for node which relies on ts-node for compiling the typescript but
it converts any import paths that use typescript alias first. It comes from
https://github.com/TypeStrong/ts-node/discussions/1450?sort=new#discussioncomment-4916809
*/

import { isBuiltin } from "node:module";
import { dirname } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

import resolveCallback from "resolve";
import { resolve as resolveTs, load } from "ts-node/esm";
import { loadConfig, createMatchPath } from "tsconfig-paths";

const resolveAsync = promisify(resolveCallback);
const extensions = [".js", ".json", ".node", ".mjs", ".tsx", ".ts", ".mts", ".cts"];

const { absoluteBaseUrl, paths } = loadConfig();
const matchPath = createMatchPath(absoluteBaseUrl, paths);

async function resolve(specifier, ctx, defaultResolve) {
    const { parentURL = pathToFileURL(absoluteBaseUrl) } = ctx;

    if (isBuiltin(specifier)) {
        return defaultResolve(specifier, ctx);
    }

    if (specifier.startsWith("file://")) {
        specifier = fileURLToPath(specifier);
    }

    let url;
    try {
        const modulePath =
            matchPath(specifier.replace(/\.js$/, ".ts")) ||
            matchPath(specifier.replace(/\.js$/, ".tsx")) ||
            matchPath(specifier) ||
            specifier.replace(/\.js$/, "");
        const resolution = await resolveAsync(modulePath, {
            basedir: dirname(fileURLToPath(parentURL)),
            // For whatever reason, --experimental-specifier-resolution=node doesn't search for .mjs extensions
            // but it does search for index.mjs files within directories
            extensions,
        });
        url = pathToFileURL(resolution).href;
    } catch (error) {
        if (error.code === "MODULE_NOT_FOUND") {
            // Match Node's error code
            error.code = "ERR_MODULE_NOT_FOUND";
        }
        throw error;
    }

    return resolveTs(url, ctx, defaultResolve);
}

export { resolve, load };
