/* @flow */

import React from "react";
import ServiceProvisions from "./ServiceProvisions";
import iss from "../../iss";
import fixtures from "../../../fixtures/services";

export default {
    title: "Service Components/ServiceProvisions",
    component: ServiceProvisions,
};

const Template = (args: Object) => <ServiceProvisions {...args} />;


export const ServiceOfferingTransitionalHousing = Template.bind({});
ServiceOfferingTransitionalHousing.args = {
    service: new iss.Service(fixtures.housingServiceSibling),
};

export const ServiceOfferingCrisisAccommodation = Template.bind({});
ServiceOfferingCrisisAccommodation.args = {
    service: new iss.Service(fixtures.susansHouse),
};

export const ServiceOfferingLegalHelp = Template.bind({});
ServiceOfferingLegalHelp.args = {
    service: new iss.Service(fixtures.legal),
};
