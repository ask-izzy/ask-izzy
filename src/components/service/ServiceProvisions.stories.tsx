import React, {ReactNode} from "react";

import ServiceProvisions from "@/src/components/service/ServiceProvisions.js";
import getServiceFixture from "@/fixtures/factories/Service.js";
import { housingServiceSibling, susansHouseService, legalService } from "@/fixtures/services.js";


export default {
    title: "Service Components/ServiceProvisions",
    component: ServiceProvisions
};

const Template = (args): ReactNode => {
    return <ServiceProvisions {...args} />;
};

export const ServiceOfferingTransitionalHousing = Template.bind({});
ServiceOfferingTransitionalHousing.args = {
    service: housingServiceSibling
};
export const ServiceOfferingCrisisAccommodation = Template.bind({});
ServiceOfferingCrisisAccommodation.args = {
    service: susansHouseService
};
export const ServiceOfferingLegalHelp = Template.bind({});
ServiceOfferingLegalHelp.args = {
    service: legalService
};
export const ServiceOfferingMoreThan4TypesOfHelp = Template.bind({});
ServiceOfferingMoreThan4TypesOfHelp.args = {
    service: getServiceFixture({
        description: "accommodation for families crisis accommodation women domestic " +
            "violence housing crisis public housing short-term housing"
    })
};