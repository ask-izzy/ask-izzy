import React, {ReactNode} from "react";
import { action } from "@storybook/addon-actions";

import FlatButton from "@/src/components/FlatButton.js";

export default {
    title: "Basic UI Components/FlatButton",
    component: FlatButton,
    args: {
        onClick: (action("clicked") as any)
    }
};

const Template = (args): ReactNode => {
    return <FlatButton {...args} />;
};

export const BasicButton = Template.bind({});
BasicButton.args = {
    label: "Example Button"
};
export const DisabledButton = Template.bind({});
DisabledButton.args = {
    label: "Example Button",
    disabled: true
};
export const ButtonWithJSXChildren = Template.bind({});
ButtonWithJSXChildren.args = {
    label: "Example Button",
    children: <p>
      As well as a label FlatButton also takes children which can be JSX
      elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </p>
};