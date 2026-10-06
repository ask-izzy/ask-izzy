#!/usr/bin/env node
/* $FlowIgnore */

/*
 * Verifies the Flow to TypeScript conversion didn't change runtime behaviour.
 *
 *   scripts/flow-to-ts/compare-compiled.js <git ref from before the conversion>
 *
 * For every file that's been converted (renamed from .js to .ts/.tsx) since
 * the given git ref this compiles both the old Flow version and the current
 * TypeScript version with the project's babel config and prints a diff of the
 * output for any files where the compiled code differs. Since babel strips
 * types the compiled output should be identical for a pure type conversion.
 */

const {execFileSync} = require("child_process")
const fs = require("fs")
const path = require("path")
const babel = require("@babel/core")

const baseRef = process.argv[2]
if (!baseRef) {
    console.error("Usage: scripts/flow-to-ts/compare-compiled.js <git ref>")
    process.exit(1)
}

const git = (...args) => execFileSync("git", args, {encoding: "utf8", maxBuffer: 1024 * 1024 * 100})

const renamed = git("diff", "-M", "--name-status", baseRef, "--", ".")
    .trim()
    .split("\n")
    .map(line => line.split("\t"))
    .filter(([status, oldPath, newPath]) =>
        status.startsWith("R") && /\.jsx?$/.test(oldPath) && /\.tsx?$/.test(newPath)
    )
    .map(([, oldPath, newPath]) => [oldPath, newPath])

function compile(code, filename) {
    return babel.transformSync(code, {
        filename: path.resolve(filename),
        envName: "production",
        comments: false,
    }).code
}

let identical = 0
const different = []
for (const [oldPath, newPath] of renamed) {
    if (!fs.existsSync(newPath)) {
        continue
    }
    const oldCode = compile(git("show", `${baseRef}:${oldPath}`), oldPath)
    const newCode = compile(fs.readFileSync(newPath, "utf8"), newPath)
    if (oldCode === newCode) {
        identical++
    } else {
        different.push([newPath, oldCode, newCode])
    }
}

for (const [file, oldCode, newCode] of different) {
    const oldLines = new Set(oldCode.split("\n"))
    const newLines = new Set(newCode.split("\n"))
    console.log(`\n${file}`)
    for (const line of oldLines) {
        if (!newLines.has(line)) {
            console.log(`  - ${line.trim()}`)
        }
    }
    for (const line of newLines) {
        if (!oldLines.has(line)) {
            console.log(`  + ${line.trim()}`)
        }
    }
}

console.log(`\n${identical} files compile identically, ${different.length} differ`)
