/* @flow */

export function flattenDomain(domain: string): string {
    // $FlowIgnore polyfill for replaceAll is imported in _app.js
    return domain.replaceAll("-", "--").replaceAll(".", "-")
}

export function unflattenDomain(domain: string): string {
    // $FlowIgnore polyfill for replaceAll is imported in _app.js
    return domain.replaceAll("--", "_").replaceAll("-", ".").replaceAll("_", "-")
}
