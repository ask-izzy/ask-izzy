/* @flow */

import type {Node} from "React";
import React from "react";

import Eligibility from "./Eligibility";

export default {
    title: "Service Components/Eligibility",
    component: Eligibility,
};

const Template = (args: Object): Node => {
    (Template.args: any); return <Eligibility {...args} />;
};

export const CatchmentIsAustralia: typeof Template = Template.bind({});
CatchmentIsAustralia.args = {
    catchment: "Australia.",
};

export const ExtensiveRequirements: typeof Template = Template.bind({});
ExtensiveRequirements.args = {
    catchment: "City of Darebin and surrounds.",
    "eligibility_info": "Victorian tenants, including people with " +
        "disabilities, who have urgent or non-urgent repairs needing " +
        "to be attended to in their rented home.",
    "ineligibility_info": "Any area of tenancy law that falls outside of " +
        "repair issues.",
    "referral_info": "Doctor.",
    "special_requirements": "All clients who have access to a smartphone, " +
        "tablet or computer are required to complete an online questionnaire.",

};
