export function flattenDomain(domain: string): string {
    return domain.replaceAll("-", "--").replaceAll(".", "-")
}

export function unflattenDomain(domain: string): string {
    return domain.replaceAll("--", "_").replaceAll("-", ".").replaceAll("_", "-")
}
