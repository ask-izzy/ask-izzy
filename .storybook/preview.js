/* @flow */

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    backgrounds: {
        default: "light",
        values: [
            { name: "light", value: "#f7f7f7" },
            { name: "dark", value: "#666" },
        ],
    },
}