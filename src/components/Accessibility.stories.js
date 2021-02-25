import React from "react";
import Accessibility from "./Accessibility";
import iss from "../iss";
import fixtures from "../../fixtures/services";

export default {
    title: "Service Components/Accessibility",
    component: Accessibility,
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

const Template = (args) => <Accessibility {...args} />;

export const ServiceWithFullAccess = Template.bind({});
ServiceWithFullAccess.args = {
    object: new iss.Service(
        {...fixtures.susansHouse, accessibility: "fullaccess"}
    ),
};

export const ServiceWithAccess = Template.bind({});
ServiceWithAccess.args = {
    object: new iss.Service(
        {...fixtures.susansHouse, accessibility: "access"}
    ),
};

export const ServiceWithNoAccess = Template.bind({});
ServiceWithNoAccess.args = {
    object: new iss.Service(
        {...fixtures.susansHouse, accessibility: "nocccess"}
    ),
};

export const ServiceWithoutAccessibilityInfo = Template.bind({});
ServiceWithoutAccessibilityInfo.args = {
    object: new iss.Service(fixtures.susansHouse),
};