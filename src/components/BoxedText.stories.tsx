import type {ReactNode} from "react";
import React from "react";

import BoxedText from "./BoxedText";

export default {
    title: "Basic UI Components/BoxedText",
    component: BoxedText,
};

const Template = (args: any): ReactNode => {
    (Template.args as any); return <BoxedText {...args} />;
};

export const BasicText: typeof Template = Template.bind({});
BasicText.args = {
    children: "Example Text",
};

export const JSXBody: typeof Template = Template.bind({});
JSXBody.args = {
    children: <div>
      The BoxedText body takes JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </div>,
};



