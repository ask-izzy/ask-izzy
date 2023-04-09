import React, {ReactNode} from "react";
import {action} from "@storybook/addon-actions";

import ListItem from "@/src/components/ListItem.js";
import Chevron from "@/src/icons/Chevron.js";
import DemographicPets from "@/src/icons/DemographicPets.js";


export default {
    title: "App Components/ListItem",
    component: ListItem,
    args: {
        onClick: (action("clicked") as any)
    }
};

const Template = (args): ReactNode => {
    return <ListItem {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary text",
    rightIcon: <Chevron />,
    leftIcon: <DemographicPets />
};
export const WithChildren = Template.bind({});
WithChildren.args = {
    primaryText: "Primary Text",
    secondaryText: "Secondary text",
    rightIcon: <Chevron />,
    leftIcon: <DemographicPets />,
    children: <div>
      Use children instead of primaryText and secondaryText props.
      Children can be JSX elements so it can contain content
      like <strong>bold text</strong> and <br /><br />
      ...new lines.
    </div>
};