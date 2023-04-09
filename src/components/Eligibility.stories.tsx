/* eslint-disable max-len */
import React, {ReactNode} from "react";

import Eligibility from "@/src/components/Eligibility.js";


export default {
    title: "Service Components/Eligibility",
    component: Eligibility
};

const Template = (args): ReactNode => {
    return <Eligibility {...args} />;
};

export const CatchmentIsAustralia = Template.bind({});
CatchmentIsAustralia.args = {
    catchment: "Australia."
};
export const ExtensiveRequirements = Template.bind({});
ExtensiveRequirements.args = {
    catchment: "City of Darebin and surrounds.",
    "eligibility_info": "Victorian tenants, including people with disabilities, who have urgent or non-urgent repairs needing to be attended to in their rented home.",
    "ineligibility_info": "Any area of tenancy law that falls outside of repair issues.",
    "referral_info": "Doctor.",
    "special_requirements": "All clients who have access to a smartphone, tablet or computer are required to complete an online questionnaire."
};