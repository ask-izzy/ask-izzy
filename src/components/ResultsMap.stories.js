/* @flow */

import React, { useState } from "react";
import { action } from "@storybook/addon-actions";

import ResultsMap from "./ResultsMap";
import fixtures from "../../fixtures/services";
import ServiceFactory from "../../fixtures/factories/Service";
import { injectEnvVars } from "../storybook/loaders";
import { addRouter, addGoogleMapsScript } from "../storybook/decorators";

export default {
    title: "App Components/ResultsMap",
    component: ResultsMap,
    loaders: [injectEnvVars],
    decorators: [addRouter, addGoogleMapsScript],
};

const Template = (args: Object) => {
    const recordOnSiteSelect = action("onSiteSelect")
    const [selectedSite, setSelectedSite] = useState(null)
    return (
        <ResultsMap
            {...args}
            selectedSite={selectedSite}
            onSiteSelect={(site) => {
                setSelectedSite(site)
                recordOnSiteSelect(site)
            }}
        />
    )
}

export const OneSite = Template.bind({});
OneSite.args = {
    ...calculateSiteProps([
        ServiceFactory(fixtures.ixa),
    ]),
};

export const ThreeSites = Template.bind({});
ThreeSites.args = {
    ...calculateSiteProps([
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
    ]),
};

export const NoSites = Template.bind({});
NoSites.args = {
    ...calculateSiteProps([]),
};

function calculateSiteProps(services: Array<issService>) {
    const sites = []
    const siteLocations = {}
    for (const {site, location} of services) {
        const id = site.id.toString()
        if (!siteLocations[id]) {
            sites.push(site)
            siteLocations[id] = location
        }
    }
    return {
        sites,
        siteLocations,
    }
}