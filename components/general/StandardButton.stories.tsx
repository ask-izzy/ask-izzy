import React, {ReactNode} from "react";
import { action } from "@storybook/addon-actions";
import StandardButton from "@/components/general/StandardButton.js";


export default {
    title: "Basic UI Components/StandardButton",
    component: StandardButton,
    args: {
        onClick: (action("clicked") as any)
    }
};

const Template = (args): ReactNode => {
    return <StandardButton {...args} />;
};

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
    label: "Example Button"
};
export const PrimaryButtonDisabled = Template.bind({});
PrimaryButtonDisabled.args = {
    label: "Example Button",
    disabled: true
};
export const PrimaryButtonWithJSXChildren = Template.bind({});
PrimaryButtonWithJSXChildren.args = {
    label: "Example Button",
    children: <p>
      As well as a label StandardButton also takes children which can be JSX
      elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </p>
};
export const SecondaryButton = Template.bind({});
SecondaryButton.args = {
    label: "Example Button",
    type: "secondary"
};
export const SecondaryButtonDisabled = Template.bind({});
SecondaryButtonDisabled.args = {
    label: "Example Button",
    disabled: true,
    type: "secondary"
};
export const SecondaryButtonWithJSXChildren = Template.bind({});
SecondaryButtonWithJSXChildren.args = {
    label: "Example Button",
    children: <p>
      As well as a label StandardButton also takes children which can be JSX
      elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </p>,
    type: "secondary"
};