import { MockedProvider } from "@apollo/client/testing";

import "@/src/styles/bundle.scss";
import { logGTMEvent } from "@/src/storybook/decorators";

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
    apolloClient: {
        MockedProvider,
    },
}

export const decorators = [logGTMEvent]
