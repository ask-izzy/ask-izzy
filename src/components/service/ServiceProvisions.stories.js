/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import ServiceProvisions from "./ServiceProvisions";
import Service from "../../../fixtures/factories/Service";
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
    service: new Service(fixtures.housingServiceSibling),
};

export const ServiceOfferingCrisisAccommodation: typeof Template =
    Template.bind({});
ServiceOfferingCrisisAccommodation.args = {
    service: new Service(fixtures.susansHouse),
};

export const ServiceOfferingLegalHelp: typeof Template = Template.bind({});
ServiceOfferingLegalHelp.args = {
    service: new Service(fixtures.legal),
};

export const ServiceOfferingMoreThan4TypesOfHelp: typeof Template = Template
    .bind({});
ServiceOfferingMoreThan4TypesOfHelp.args = {
    service: new Service({
        description:
            "accommodation for families crisis accommodation women domestic " +
            "violence housing crisis public housing short-term housing",
    }),
};
