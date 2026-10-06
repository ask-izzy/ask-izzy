#!/usr/bin/env node
/* $FlowIgnore */

/*
 * Converts Flow annotated source files to TypeScript.
 *
 *   scripts/flow-to-ts/convert.js [--dry-run] <file.js>...
 *
 * Each file is parsed with babel and only the parts of the source which are
 * Flow specific are rewritten. Everything else (formatting, comments, etc) is
 * left untouched. Files are renamed (using `git mv` so history is preserved)
 * to .tsx if they contain JSX or .ts otherwise.
 *
 * This is intended as a one-off migration tool. It doesn't try to handle every
 * Flow feature, only those used in this codebase. Anything it can't express in
 * TypeScript will show up as a type error to be fixed by hand.
 */

const fs = require("fs")
const path = require("path")
const {execFileSync} = require("child_process")
const {parse} = require("@babel/parser")
const traverse = require("@babel/traverse").default

// Names of types exported by the "react" module in Flow and what they're called in @types/react
const reactTypeRenames = {
    Node: "ReactNode",
    Element: "ReactElement",
    ElementConfig: "ComponentProps",
    AbstractComponent: "ComponentType",
    StatelessFunctionalComponent: "FunctionComponent",
    ChildrenArray: "ReactNode",
}

// Global Flow types and their TypeScript equivalents. Only applied when the
// name isn't declared or imported in the file.
const globalTypeRenames = {
    "mixed": "unknown",
    "Object": "any",
    "React$Node": "React.ReactNode",
    "React$Element": "React.ReactElement",
    "React$Component": "React.Component",
    "React$Context": "React.Context",
    "React$ComponentType": "React.ComponentType",
    "React$AbstractComponent": "React.ComponentType",
    "React.Node": "React.ReactNode",
    "React.Element": "React.ReactElement",
    "React.ElementConfig": "React.ComponentProps",
    "React.AbstractComponent": "React.ComponentType",
    "React.StatelessFunctionalComponent": "React.FunctionComponent",
    "SyntheticEvent": "React.SyntheticEvent",
    "SyntheticInputEvent": "React.ChangeEvent",
    "SyntheticKeyboardEvent": "React.KeyboardEvent",
    "SyntheticFocusEvent": "React.FocusEvent",
    "SyntheticMouseEvent": "React.MouseEvent",
    "Position": "GeolocationPosition",
    "PositionError": "GeolocationPositionError",
    "$ReadOnly": "Readonly",
    "$ReadOnlyArray": "ReadonlyArray",
    "$Shape": "Partial",
    "ProcessWithEnvVars": "NodeJS.Process",
}

// Generic types where Flow takes a second type argument that TypeScript doesn't
const dropSecondTypeArg = new Set([
    "React$AbstractComponent",
    "React.AbstractComponent",
])

// Imports of these modules are redirected to their new TypeScript home
const movedModules = {
    "flow/routes": "@/types/routes",
    "flow/personalisation-page": "@/types/personalisation-page",
    "flow/shared/html-elements": "@/types/html-elements",
}

function convert(source, filename, filesBeingConverted = new Set()) {
    const ast = parse(source, {
        sourceType: "module",
        plugins: ["jsx", "flow"],
        sourceFilename: filename,
    })

    // Edits are registered while traversing so an edit for a parent node always
    // has a lower index than the edits for its children
    const edits = []
    const replace = (start, end, text) => {
        edits.push({start, end, text, index: edits.length})
    }
    const replaceNode = (node, text) => replace(node.start, node.end, text)

    // Renders a range of the original source with any edits inside it applied.
    // If we're rendering on behalf of an edit then edits covering the exact
    // same range are only applied if they belong to a child node.
    let currentEdit = null
    function render(start, end) {
        let out = ""
        let pos = start
        const inRange = edits
            .filter(edit => edit.start >= start && edit.end <= end)
            .filter(edit =>
                !currentEdit ||
                edit.start !== currentEdit.start ||
                edit.end !== currentEdit.end ||
                edit.index > currentEdit.index
            )
            .sort((a, b) =>
                a.start - b.start ||
                (b.end - b.start) - (a.end - a.start) ||
                a.index - b.index
            )
        for (const edit of inRange) {
            if (edit.start < pos) {
                // Nested inside an edit we've already applied
                continue
            }
            out += source.slice(pos, edit.start)
            if (typeof edit.text === "function") {
                const parentEdit = currentEdit
                currentEdit = edit
                out += edit.text()
                currentEdit = parentEdit
            } else {
                out += edit.text
            }
            pos = edit.end
        }
        return out + source.slice(pos, end)
    }
    const R = node => render(node.start, node.end)

    // Collect every type name declared or imported in the file so we know which
    // global renames are safe
    const localTypeNames = new Set()
    let hasJsx = false
    traverse(ast, {
        TypeAlias(p) {
            localTypeNames.add(p.node.id.name)
        },
        InterfaceDeclaration(p) {
            localTypeNames.add(p.node.id.name)
        },
        ClassDeclaration(p) {
            p.node.id && localTypeNames.add(p.node.id.name)
        },
        ImportSpecifier(p) {
            localTypeNames.add(p.node.local.name)
        },
        ImportDefaultSpecifier(p) {
            localTypeNames.add(p.node.local.name)
        },
        TypeParameter(p) {
            localTypeNames.add(p.node.name)
        },
        JSXElement() {
            hasJsx = true
        },
        JSXFragment() {
            hasJsx = true
        },
    })

    const typeName = id => id.type === "QualifiedTypeIdentifier" ?
        `${typeName(id.qualification)}.${id.id.name}`
        : id.name

    function updateModuleSource(node) {
        let moduleName = node.source.value
        if (moduleName === "React") {
            moduleName = "react"
            replaceNode(node.source, JSON.stringify(moduleName))
        }
        // Imports of files being converted can't include the .js extension
        if (/^(\.|@\/).*\.jsx?$/.test(moduleName)) {
            const resolved = moduleName.startsWith("@/") ?
                path.normalize(moduleName.slice(2))
                : path.normalize(path.join(path.dirname(filename), moduleName))
            if (filesBeingConverted.has(resolved)) {
                moduleName = moduleName.replace(/\.jsx?$/, "")
                replaceNode(node.source, JSON.stringify(moduleName))
            }
        }
        for (const [from, to] of Object.entries(movedModules)) {
            if (moduleName === `@/${from}` || moduleName.endsWith(`../${from}`)) {
                replaceNode(node.source, JSON.stringify(to))
            }
        }
        return moduleName
    }

    traverse(ast, {
        ExportNamedDeclaration(p) {
            if (p.node.source) {
                updateModuleSource(p.node)
            }
        },
        ExportAllDeclaration(p) {
            updateModuleSource(p.node)
        },
        ImportDeclaration(p) {
            const node = p.node
            const moduleName = updateModuleSource(node)
            if (moduleName === "react") {
                for (const specifier of node.specifiers) {
                    const isType = node.importKind === "type" || specifier.importKind === "type"
                    if (
                        specifier.type !== "ImportSpecifier" || !isType ||
                        !reactTypeRenames[specifier.imported.name]
                    ) {
                        continue
                    }
                    const newName = reactTypeRenames[specifier.imported.name]
                    const prefix = specifier.importKind === "type" ? "type " : ""
                    const local = specifier.local.name
                    replaceNode(
                        specifier,
                        `${prefix}${newName}${local === newName ? "" : ` as ${local}`}`
                    )
                    if (specifier.imported.name === "AbstractComponent") {
                        dropSecondTypeArg.add(local)
                    }
                }
            }
        },

        NullableTypeAnnotation(p) {
            const inner = p.node.typeAnnotation
            const innerNeedsParens = [
                "FunctionTypeAnnotation",
                "UnionTypeAnnotation",
                "IntersectionTypeAnnotation",
            ].includes(inner.type)
            const outerNeedsParens = [
                "ArrayTypeAnnotation",
                "IntersectionTypeAnnotation",
                "NullableTypeAnnotation",
            ].includes(p.parent.type)
            replaceNode(p.node, () => {
                let text = R(inner)
                if (innerNeedsParens && !/^\(.*\)$/s.test(text)) {
                    text = `(${text})`
                }
                text = `${text} | null | undefined`
                return outerNeedsParens ? `(${text})` : text
            })
        },

        ObjectTypeAnnotation(p) {
            const node = p.node
            const spreads = node.properties.filter(prop => prop.type === "ObjectTypeSpreadProperty")
            if (!node.exact && !node.inexact && !spreads.length) {
                return
            }
            replaceNode(node, () => {
                const open = node.exact ? 2 : 1
                const contentStart = node.start + open
                const contentEnd = node.end - open
                const members = [
                    ...node.properties,
                    ...node.indexers,
                    ...node.callProperties,
                    ...node.internalSlots,
                ].sort((a, b) => a.start - b.start)
                const kept = members.filter(member => member.type !== "ObjectTypeSpreadProperty")

                let body
                if (!kept.length) {
                    body = ""
                } else if (!spreads.length) {
                    body = render(contentStart, contentEnd)
                } else {
                    // Rebuild the body from the remaining members keeping the
                    // whitespace that preceded each one
                    body = ""
                    for (const member of kept) {
                        const index = members.indexOf(member)
                        const prevEnd = index === 0 ? contentStart : members[index - 1].end
                        const leading = source.slice(prevEnd, member.start).replace(/^\s*,/, "")
                        body += (body ? "," : "") + leading + R(member)
                    }
                    const lastKept = kept[kept.length - 1]
                    let tail = source.slice(lastKept.end, contentEnd)
                    if (spreads.some(spread => spread.start > lastKept.end)) {
                        tail = (/^\s*,/.test(tail) ? "," : "") + tail.match(/\s*$/)[0]
                    }
                    body += tail
                }

                if (node.inexact) {
                    body = body.replace(/,?(\s*)\.\.\.(\s*),?(\s*)$/, "$1$3")
                }

                const parts = spreads.map(spread => R(spread.argument))
                if (kept.length || !parts.length) {
                    parts.push(`{${body}}`)
                }
                return parts.join(" & ")
            })
        },

        ObjectTypeIndexer(p) {
            if (!p.node.id) {
                replaceNode(p.node.key, () => `key: ${R(p.node.key)}`)
            }
        },

        Variance(p) {
            replaceNode(p.node, p.node.kind === "plus" ? "readonly " : "")
        },

        FunctionTypeAnnotation(p) {
            const node = p.node
            // TypeScript requires function types to be parenthesised when used
            // as part of a union, intersection or array type
            const needsParens = [
                "UnionTypeAnnotation",
                "IntersectionTypeAnnotation",
                "ArrayTypeAnnotation",
            ].includes(p.parent.type)
            if (needsParens && !/\($/.test(source.slice(0, node.start).trimEnd())) {
                replaceNode(node, () => `(${R(node)})`)
            }

            // Flow allows single param functions to omit the parens (eg `string => void`)
            const paramsParenthesised = /^[(<]/.test(source.slice(node.start))
            const params = [...node.params, ...(node.rest ? [node.rest] : [])]
            const optional = trailingOptionalParams(
                node.params,
                param => param.optional,
                param => param.typeAnnotation
            )
            params.forEach((param, index) => {
                const makeOptional = optional.has(param)
                if (!param.name) {
                    // Babel includes the trailing comma in the range of a param
                    // without a name so only replace the type
                    const name = param === node.rest ? "args" : `arg${index}`
                    replaceNode(param.typeAnnotation, () => {
                        const text = `${name}${makeOptional ? "?" : ""}: ${R(param.typeAnnotation)}`
                        return paramsParenthesised ? text : `(${text})`
                    })
                } else if (makeOptional) {
                    replace(param.name.end, param.name.end, "?")
                }
            })
        },

        JSXText(p) {
            // TSX doesn't allow ">" or "}" to appear in JSX text
            const text = source.slice(p.node.start, p.node.end)
            if (/[>}]/.test(text)) {
                replaceNode(p.node, text.replace(/[>}]/g, char => `{"${char}"}`))
            }
        },

        Function(p) {
            // Flow allows trailing params with a nullable type to be omitted
            // but TypeScript requires them to be marked as optional
            const optional = trailingOptionalParams(
                p.node.params,
                param => param.optional || param.type === "AssignmentPattern" ||
                    param.type === "RestElement",
                param => param.typeAnnotation && param.typeAnnotation.typeAnnotation
            )
            for (const param of optional) {
                if (param.type === "Identifier" && !param.optional) {
                    const nameEnd = param.start + param.name.length
                    replace(nameEnd, nameEnd, "?")
                }
            }
            if (p.node.predicate) {
                // %checks predicates don't have a TypeScript equivalent
                const start = p.node.predicate.start
                const precedingSpace = source.slice(0, start).match(/[ \t]*$/)[0].length
                replace(start - precedingSpace, p.node.predicate.end, "")
            }
        },

        ClassProperty(p) {
            if (p.node.variance) {
                replaceNode(p.node.variance, p.node.variance.kind === "plus" ? "readonly " : "")
            }
        },

        TypeParameter(p) {
            const node = p.node
            if (node.bound) {
                replaceNode(node.bound, () => ` extends ${R(node.bound.typeAnnotation)}`)
            }
        },

        TypeCastExpression(p) {
            const node = p.node
            const type = node.typeAnnotation.typeAnnotation
            if (type.type === "GenericTypeAnnotation" && typeName(type.id) === "Class") {
                // These casts are used to annotate HOCs (eg withRouter) which
                // are already properly typed in TypeScript
                if (node.extra && node.extra.parenthesized) {
                    const closeParen = source.indexOf(")", node.end)
                    replace(node.extra.parenStart, closeParen + 1, () => R(node.expression))
                } else {
                    replaceNode(node, () => R(node.expression))
                }
                return
            }
            replaceNode(node, () => `${R(node.expression)} as ${R(type)}`)
        },

        ExistsTypeAnnotation(p) {
            replaceNode(p.node, "any")
        },

        EmptyTypeAnnotation(p) {
            replaceNode(p.node, "never")
        },

        MixedTypeAnnotation(p) {
            replaceNode(p.node, "unknown")
        },

        GenericTypeAnnotation(p) {
            const node = p.node
            const name = typeName(node.id)
            const args = node.typeParameters ? node.typeParameters.params : []

            switch (name) {
            case "$Keys":
                return replaceNode(node, () => `keyof ${R(args[0])}`)
            case "$Values":
                return replaceNode(node, () => `${R(args[0])}[keyof ${R(args[0])}]`)
            case "$Exact":
                return replaceNode(node, () => R(args[0]))
            case "$Diff":
                return replaceNode(node, () => `Omit<${R(args[0])}, keyof ${R(args[1])}>`)
            case "$PropertyType":
            case "$ElementType":
                return replaceNode(node, () => `${R(args[0])}[${R(args[1])}]`)
            case "$Call":
                if (args.length === 1) {
                    return replaceNode(node, () => `ReturnType<${R(args[0])}>`)
                }
                break
            case "Class":
                return replaceNode(node, () => `typeof ${R(args[0])}`)
            }

            const rootName = name.split(".")[0]
            if (globalTypeRenames[name] && !localTypeNames.has(rootName)) {
                replaceNode(node.id, globalTypeRenames[name])
            }
            if (dropSecondTypeArg.has(name) && args.length > 1) {
                replace(args[0].end, node.typeParameters.end - 1, "")
            }
        },

        DeclareFunction(p) {
            // Flow uses "declare function" to declare overloads. In
            // TypeScript overloads are just a function without a body.
            const node = p.node
            const text = source.slice(node.start, node.end)
            replaceNode(node, () => {
                let out = text.replace(/^declare\s+/, "")
                if (!out.trimEnd().endsWith(";")) {
                    out += ";"
                }
                return out
            })
        },
    })

    let output = render(0, source.length)

    // Remove flow pragmas and suppression comments. Type errors that these were
    // suppressing will be suppressed again with @ts-expect-error once we know
    // which are still relevant.
    output = output
        .replace(/^[ \t]*\/[*/]\s*@flow( strict)?\s*(\*\/)?[ \t]*\n/gm, "")
        .replace(/^(#![^\n]*\n)?\s*\/\*\s*\$FlowIgnore\s*\*\/[ \t]*\n/, "$1")
        .replace(/^[ \t]*\/\/\s*\$Flow(Ignore|FixMe|Issue|ExpectedError)\b.*\n/gm, "")
        .replace(/^[ \t]*\{?\/\*\s*\$Flow(Ignore|FixMe|Issue|ExpectedError)\b[^]*?\*\/\}?[ \t]*\n/gm, "")
        .replace(/[ \t]*\/\/\s*\$Flow(Ignore|FixMe|Issue|ExpectedError)\b.*$/gm, "")
        .replace(/[ \t]*\/\*\s*\$Flow(Ignore|FixMe|Issue|ExpectedError)\b[^]*?\*\//gm, "")
        .replace(/^(#![^\n]*\n)?\n+/, "$1")

    return {output, hasJsx}
}

// Returns the set of params at the end of a param list which are nullable (and
// so can be omitted in Flow)
function trailingOptionalParams(params, isAlreadyOptional, getType) {
    const optional = new Set()
    for (const param of [...params].reverse()) {
        const type = getType(param)
        if (isAlreadyOptional(param)) {
            continue
        }
        if (type && type.type === "NullableTypeAnnotation") {
            optional.add(param)
            continue
        }
        break
    }
    return optional
}

function main() {
    const args = process.argv.slice(2)
    const dryRun = args[0] === "--dry-run"
    const files = dryRun ? args.slice(1) : args
    const filesBeingConverted = new Set(files.map(file => path.normalize(file)))
    let failed = false

    for (const file of files) {
        let result
        try {
            result = convert(fs.readFileSync(file, "utf8"), file, filesBeingConverted)
        } catch (error) {
            console.error(`Failed to convert ${file}: ${error.message}`)
            failed = true
            continue
        }
        const newFile = file.replace(/\.jsx?$/, result.hasJsx ? ".tsx" : ".ts")
        if (dryRun) {
            console.log(`===== ${newFile}`)
            console.log(result.output)
            continue
        }
        execFileSync("git", ["mv", file, newFile])
        fs.writeFileSync(newFile, result.output)
        console.log(`${file} -> ${path.basename(newFile)}`)
    }

    if (failed) {
        process.exit(1)
    }
}

if (require.main === module) {
    main()
}

module.exports = {convert}
