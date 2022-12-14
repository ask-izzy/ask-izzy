import React, {ReactNode} from "react";

import BoxedText from "@/src/components/BoxedText";
export default {
    title: "Basic UI Components/BoxedText",
    component: BoxedText
};

const Template = (args: Record<string, any>): ReactNode => {
    return <BoxedText {...args} />;
};

export const BasicText = Template.bind({});
BasicText.args = {
    children: "Example Text"
};
export const JSXBody = Template.bind({});
JSXBody.args = {
    children: <div>
      The BoxedText body takes JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </div>
};