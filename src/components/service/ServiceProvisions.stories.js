/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import ServiceProvisions from "./ServiceProvisions";
import iss from "../../iss";
import fixtures from "../../../fixtures/services";

export default {
    title: "Service Components/ServiceProvisions",
    component: ServiceProvisions,
};

const Template = (args: Object): ReactNode => {
    (Template.args: any); return <ServiceProvisions {...args} />;
};


export const ServiceOfferingTransitionalHousing: typeof Template =
    Template.bind({});
ServiceOfferingTransitionalHousing.args = {
    service: new iss.Service(fixtures.housingServiceSibling),
};

export const ServiceOfferingCrisisAccommodation: typeof Template =
    Template.bind({});
ServiceOfferingCrisisAccommodation.args = {
    service: new iss.Service(fixtures.susansHouse),
};

export const ServiceOfferingLegalHelp: typeof Template = Template.bind({});
ServiceOfferingLegalHelp.args = {
    service: new iss.Service(fixtures.legal),
};
