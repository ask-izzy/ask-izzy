/* @flow */
// eslint-disable-next-line no-unused-vars
import GlobalStyle from "../src/styles/bundle.scss";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    backgrounds: {
        default: "light",
        values: [
            { name: "light", value: "#f7f7f7" },
            { name: "dark", value: "#666" },
        ],
    },
    options: {
        storySort: {
            order: [
                "App Components",
                "Service Components",
                "Basic UI Components",
                "Icons",
            ],
        },
    },
}
