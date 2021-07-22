/* @flow */

import type {Node} from "React";
import React from "react";
import Accordion from "./Accordion";

export default {
    title: "Basic UI Components/Accordion",
    component: Accordion,
    argTypes: ({}: {...}),
};

const Template = (args: Object): Node => {
    (Template.args: any); return <Accordion {...args} />;
};

export const BasicText: typeof Template = Template.bind({});
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
