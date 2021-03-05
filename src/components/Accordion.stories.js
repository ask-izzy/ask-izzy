/* @flow */

import React from "react";
import Accordion from "./Accordion";

export default {
    title: "Basic UI Components/Accordion",
    component: Accordion,
    argTypes: {},
};

const Template = (args: Object) => <Accordion {...args} />;

export const BasicText = Template.bind({});
BasicText.args = {
    title: "Accordion Title",
    items: [
        {
            Title: "Section 1",
            Content: "The sun was shining on the sea",
        },
        {
            Title: "Section 2",
            Content: "Shining with all his might",
        },
        {
            Title: "Section 3",
            Content: "He did his very best to make",
        },
        {
            Title: "Section 4",
            Content: "The billows smooth and bright",
        },
    ],
};