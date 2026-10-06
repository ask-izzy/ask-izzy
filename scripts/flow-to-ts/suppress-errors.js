#!/usr/bin/env node
/* $FlowIgnore */

/*
 * Suppresses any remaining TypeScript errors after converting from Flow by
 * adding "@ts-expect-error TODO(ts-migration)" comments above each error.
 *
 *   scripts/flow-to-ts/suppress-errors.js
 *
 * Before suppressing it automatically fixes errors caused by Next.js typing
 * router query params as `string | string[]` (Flow typed them as `string`) by
 * casting them to string. That's what the code already assumed.
 *
 * Each suppression should eventually be fixed properly. They can be found by
 * searching for "TODO(ts-migration)".
 */

const fs = require("fs")
const path = require("path")
const ts = require("typescript")

const MAX_LINE_LENGTH = 120
const TODO = "TODO(ts-migration)"

function getDiagnostics() {
    const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.json")
    const {config} = ts.readConfigFile(configPath, ts.sys.readFile)
    const parsed = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(configPath))
    const program = ts.createProgram({
        rootNames: parsed.fileNames,
        options: {...parsed.options, incremental: false},
    })
    return ts.getPreEmitDiagnostics(program)
        .filter(diagnostic => diagnostic.file && !diagnostic.file.fileName.includes("/node_modules/"))
}

function findNode(sourceFile, start, length) {
    let found
    function visit(node) {
        if (node.getStart(sourceFile) <= start && node.getEnd() >= start + length) {
            found = node
            ts.forEachChild(node, visit)
        }
    }
    visit(sourceFile)
    return found
}

const isStringOrStringArrayError = diagnostic => /'string \| string\[\]' is not assignable to (parameter of )?type 'string'|'string\[\]' is not assignable to type 'string'/.test(
    ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
)

// Cast `router.query.foo` style expressions to string
function fixQueryParamTypes(diagnostics) {
    const editsByFile = new Map()
    for (const diagnostic of diagnostics.filter(isStringOrStringArrayError)) {
        const node = findNode(diagnostic.file, diagnostic.start, diagnostic.length)
        if (!node || !/query/.test(node.getText(diagnostic.file))) {
            continue
        }
        // If the error is on a JSX attribute name then the value needs casting
        let expression = node
        if (ts.isIdentifier(node) && ts.isJsxAttribute(node.parent)) {
            const initializer = node.parent.initializer
            if (!initializer || !ts.isJsxExpression(initializer)) {
                continue
            }
            expression = initializer.expression
        }
        const edits = editsByFile.get(diagnostic.file.fileName) || []
        edits.push({
            start: expression.getStart(diagnostic.file),
            end: expression.getEnd(),
        })
        editsByFile.set(diagnostic.file.fileName, edits)
    }
    for (const [fileName, edits] of editsByFile) {
        let source = fs.readFileSync(fileName, "utf8")
        for (const {start, end} of edits.sort((a, b) => b.start - a.start)) {
            source = `${source.slice(0, start)}(${source.slice(start, end)} as string)${source.slice(end)}`
        }
        fs.writeFileSync(fileName, source)
    }
    return editsByFile.size
}

// Is the given position in the children of a JSX element (where comments need to be wrapped in braces)
function isInJsxChildren(sourceFile, position) {
    let node = findNode(sourceFile, position, 0)
    while (node && node !== sourceFile) {
        if (ts.isJsxAttributes(node) || ts.isJsxExpression(node) && node.getStart(sourceFile) < position) {
            return false
        }
        const parent = node.parent
        if (
            parent && (ts.isJsxElement(parent) || ts.isJsxFragment(parent)) &&
            parent.children.includes(node)
        ) {
            return true
        }
        node = parent
    }
    return false
}

function suppressErrors(diagnostics) {
    const linesByFile = new Map()
    for (const diagnostic of diagnostics) {
        const {line} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
        const lines = linesByFile.get(diagnostic.file) || new Map()
        if (!lines.has(line)) {
            lines.set(line, diagnostic)
        }
        linesByFile.set(diagnostic.file, lines)
    }

    for (const [sourceFile, lines] of linesByFile) {
        const text = fs.readFileSync(sourceFile.fileName, "utf8").split("\n")
        for (const [line, diagnostic] of [...lines].sort((a, b) => b[0] - a[0])) {
            const indent = text[line].match(/^\s*/)[0]
            const lineStart = sourceFile.getPositionOfLineAndCharacter(line, 0) + indent.length
            const inJsx = isInJsxChildren(sourceFile, lineStart)
            const [open, close] = inJsx ? ["{/* ", " */}"] : ["// ", ""]
            const prefix = `${open}@ts-expect-error ${TODO}: `
            const available = MAX_LINE_LENGTH - indent.length - prefix.length - close.length
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
                .split("\n")[0]
                .replace(/\*\//g, "* /")
                .trim()
            if (message.length > available) {
                message = message.slice(0, available - 1) + "…"
            }
            text.splice(line, 0, `${indent}${prefix}${message}${close}`)
        }
        fs.writeFileSync(sourceFile.fileName, text.join("\n"))
        console.log(`${path.relative(process.cwd(), sourceFile.fileName)}: ${lines.size}`)
    }
}

function main() {
    let diagnostics = getDiagnostics()
    if (fixQueryParamTypes(diagnostics)) {
        diagnostics = getDiagnostics()
    }
    suppressErrors(diagnostics)
    const remaining = getDiagnostics()
    if (remaining.length) {
        console.error(`${remaining.length} errors remain:`)
        console.error(ts.formatDiagnostics(remaining, {
            getCanonicalFileName: fileName => fileName,
            getCurrentDirectory: () => process.cwd(),
            getNewLine: () => "\n",
        }))
        process.exit(1)
    }
}

main()
