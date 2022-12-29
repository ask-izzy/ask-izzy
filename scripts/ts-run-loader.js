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
https://github.com/TypeStrong/ts-node/discussions/1450?sort=new#discussioncomment-1806115
*/

import { resolve as resolveTs } from "ts-node/esm"
import * as tsConfigPaths from "tsconfig-paths"
import { pathToFileURL } from "url"

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig()
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths)

export function resolve(specifier, ctx, defaultResolve) {
    const lastIndexOfIndex = specifier.lastIndexOf("/index.js")
    if (lastIndexOfIndex !== -1) {
        // Handle index.js
        const trimmed = specifier.substring(0, lastIndexOfIndex)
        const match = matchPath(trimmed)
        if (match) {
            return resolveTs(pathToFileURL(`${match}/index.js`).href, ctx, defaultResolve)
        }
    } else if (specifier.endsWith(".js")) {
        // Handle *.js
        const trimmed = specifier.substring(0, specifier.length - 3)
        const match = matchPath(trimmed)
        if (match) {
            return resolveTs(pathToFileURL(`${match}.js`).href, ctx, defaultResolve)
        }
    }
    return resolveTs(specifier, ctx, defaultResolve)
}

export { load, transformSource } from "ts-node/esm"
