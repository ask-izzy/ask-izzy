/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import AccordionItem from "./AccordionItem";

export default {
    title: "Basic UI Components/Accordion/AccordionItem",
    component: AccordionItem,
    argTypes: ({}: {...}),
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <AccordionItem {...args} />;
};

export const BasicText: typeof Template = Template.bind({});
BasicText.args = {
    title: "Section Title",
    children: "Very boring bog-standard text of no interest whatsoever.",
};
export const JSXBodyContent: typeof Template = Template.bind({});
JSXBodyContent.args = {
    title: "Section Title",
    children: <p>
      The Accordion body takes JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </p>,
};
