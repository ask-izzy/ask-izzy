import { addDecorator } from "@storybook/react";
import { MemoryRouter } from "react-router";
import React from "react";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
}

// Stop React Router complaining about <Link> being used outside of a router
addDecorator(
    story => <MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
);