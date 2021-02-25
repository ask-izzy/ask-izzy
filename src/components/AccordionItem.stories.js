import React from "react";
import AccordionItem from "./AccordionItem";

export default {
    title: "Basic UI Components/AccordionItem",
    component: AccordionItem,
    argTypes: {},
    parameters: {
        backgrounds: {
            default: "White",
            values: [
                { name: "White", value: "#fff" },
            ],
        },
    },
};

const Template = (args) => <AccordionItem {...args} />;

export const BasicText = Template.bind({});
BasicText.args = {
    title: "Section Title",
    children: "Very boring bog-standard text of no interest whatsoever.",
};
export const JSXBodyContent = Template.bind({});
JSXBodyContent.args = {
    title: "Section Title",
    children: <p>
      The Accordion body takes JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </p>,
};