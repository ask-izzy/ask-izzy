import React, {ReactNode} from "react";

import AccordionItem from "@/src/components/AccordionItem.js";

export default {
    title: "Basic UI Components/Accordion/AccordionItem",
    component: AccordionItem,
    argTypes: ({} as Record<string, never>)
};

const Template = (args): ReactNode => {
    return <AccordionItem {...args} />;
};

export const BasicText = Template.bind({});
BasicText.args = {
    title: "Section Title",
    children: "Very boring bog-standard text of no interest whatsoever."
};
export const JSXBodyContent = Template.bind({});
JSXBodyContent.args = {
    title: "Section Title",
    children: <p>
      The Accordion body takes JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </p>
};