/* @flow */
declare var clientEnvPath: string;

let env

export async function injectEnvVars() {
    if (!env) {
        const res = await fetch(clientEnvPath)
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
