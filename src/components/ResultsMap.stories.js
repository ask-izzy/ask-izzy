/* @flow */

import React from "react";
import { action } from "@storybook/addon-actions";

import ResultsMap from "./ResultsMap";
import fixtures from "../../fixtures/services";
import ServiceFactory from "../../fixtures/factories/Service";
import { injectEnvVars } from "../storybook/loaders";
import { addRouter, addGoogleMapsScript } from "../storybook/decorators";


export default {
    title: "App Components/ResultsMap",
    component: ResultsMap,
    args: {
        onServicesChange: action("servicesChanged"),
    },
    loaders: [injectEnvVars],
    decorators: [addRouter, addGoogleMapsScript],
};

const Template = (args: Object) => (
    <ResultsMap
        {...args}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
    />
)

export const SingleService = Template.bind({});
SingleService.args = {
    objects: [
        ServiceFactory(fixtures.ixa),
    ],
};

export const ThreeServices = Template.bind({});
ThreeServices.args = {
    objects: [
        ServiceFactory(fixtures.ixa),
        ServiceFactory(fixtures.housingService),
        ServiceFactory(ServiceFactory({
            location: {
                suburb: "Geelong",
                point: {
                    lat: -38.1472,
                    lon: 144.3575,
                },
            },
        })),
    ],
};

export const MultipleServicesWithTheSameSite = Template.bind({});
MultipleServicesWithTheSameSite.args = {
    objects: [
        ServiceFactory(fixtures.housingService),
        ServiceFactory(fixtures.housingServiceSibling),
    ],
};

export const ServicesWithConfidentialLocationIgnored = Template.bind({});
ServicesWithConfidentialLocationIgnored.args = {
    objects: [
        ServiceFactory(fixtures.domesticviolence),
        ServiceFactory(fixtures.ixa),
    ],
};
