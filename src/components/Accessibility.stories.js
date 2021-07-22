/* @flow */

import type {Node} from "React";
import React from "react";
import Accessibility from "./Accessibility";
import iss from "../iss";
import fixtures from "../../fixtures/services";

export default {
    title: "Service Components/Accessibility",
    component: Accessibility,
    argTypes: ({}: {...}),
};

const Template = (args: Object): Node => {
    (Template.args: any); return <Accessibility {...args} />
};

export const ServiceWithFullAccess: typeof Template = Template.bind({});
ServiceWithFullAccess.args = {
    object: new iss.Service(
        {...fixtures.susansHouse, accessibility: "fullaccess"}
    ),
};

export const ServiceWithAccess: typeof Template = Template.bind({});
ServiceWithAccess.args = {
    object: new iss.Service(
        {...fixtures.susansHouse, accessibility: "access"}
    ),
};

export const ServiceWithNoAccess: typeof Template = Template.bind({});
ServiceWithNoAccess.args = {
    object: new iss.Service(
        {...fixtures.susansHouse, accessibility: "nocccess"}
    ),
};

export const ServiceWithoutAccessibilityInfo: typeof Template =
    Template.bind({});
ServiceWithoutAccessibilityInfo.args = {
    object: new iss.Service(fixtures.susansHouse),
};
