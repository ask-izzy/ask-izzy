/* @flow */

import React, { useState } from "react";
import { action } from "@storybook/addon-actions";

import InputListItem from "./InputListItem";
import icons from "../icons"

export default {
    title: "App Components/ListItem/InputListItem",
    component: InputListItem,
    args: {
        primaryText: "Primary Text",
        secondaryText: "Secondary text",
        onClick: action("clicked"),
    },
};

const Template = (args: Object) => {
    const [checked, setChecked] = useState(args.checked)

    return (
        <InputListItem
            {...args}
            value={checked}
            checked={checked}
            onClick={event => {
                setChecked(!checked);
                if (args.onClick) {
                    args.onClick(event)
                }
                event.preventDefault(); // Stop link navigating away
            }}
        />
    )
};

export const RadioInput = Template.bind({});
RadioInput.args = {
    type: "radio",
};

export const CheckboxInput = Template.bind({});
CheckboxInput.args = {
    type: "checkbox",
};

export const WithIcons = Template.bind({});
WithIcons.args = {
    type: "checkbox",
    checkedIcon: <icons.DemographicPets />,
    uncheckedIcon: <icons.Car />,
};
