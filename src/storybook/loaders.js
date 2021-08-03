/* @flow */
let env

export async function injectEnvVars(): Promise<{|env: any|}> {
    if (!env) {
        const res = await fetch("env-vars.js")
        const envFile = await res.text()

        // eslint-disable-next-line no-eval
        env = eval(`
            var window = {};
            ${envFile}
            window;
        `)
    }
    return { env }
}
