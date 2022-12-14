import React, {ReactNode} from "react";

import ResultListItem from "@/src/components/ResultListItem";
import getServiceFixture from "@/fixtures/factories/Service";
import { getAddressLocationPropsFixture } from "@/fixtures/factories/AddressLocation";
import { ixaService, susansHouseService, housingService, domesticViolenceService } from "@/fixtures/services";

export default {
    title: "App Components/ResultsList/ResultListItem",
    component: ResultListItem,
    argTypes: {}
};

const Template = (args): ReactNode => {
    return <ResultListItem {...args} />;
};

export const InfoxchangeExample = Template.bind({});
InfoxchangeExample.args = {
    service: ixaService
};
export const SusansHouse = Template.bind({});
SusansHouse.args = {
    service: susansHouseService
};
export const HousingService = Template.bind({});
HousingService.args = {
    service: housingService
};
export const ConfidentialLocation = Template.bind({});
ConfidentialLocation.args = {
    service: domesticViolenceService
};
export const ServiceWithFlags = Template.bind({});
ServiceWithFlags.args = {
    service: getServiceFixture({
        lgbtiqa_plus_specific: true,
        indigenous_classification: ["Aboriginal (indigenous) specific"],
        location: {
            suburb: "Richmond",
            point: {
                lat: -37.8228,
                lon: 144.998
            }
        }
    })
};
export const NDISService = Template.bind({});
NDISService.args = {
    service: getServiceFixture({
        ndis_approved: true,
        location: getAddressLocationPropsFixture({
            suburb: "Richmond",
            point: {
                lat: -37.8228,
                lon: 144.998
            }
        })
    })
};