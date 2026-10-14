// In Flow `window` is typed as `any`. To keep the same behaviour after the
// migration to TypeScript allow any property to be accessed on it. This should
// be replaced with declarations for the specific properties we use.
interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}
