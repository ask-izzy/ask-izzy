/* @flow */

import type {Node} from "React";
import React, { useState } from "react";
import { action } from "@storybook/addon-actions";

import SitesMap from "./SitesMap";
import fixtures from "../../fixtures/services";
import ServiceFactory from "../../fixtures/factories/Service";
import { injectEnvVars } from "../storybook/loaders";
import { addRouter, addGoogleMapsScript } from "../storybook/decorators";

export default {
    title: "App Components/SitesMap",
    component: SitesMap,
    loaders: [injectEnvVars],
    decorators: [addRouter, addGoogleMapsScript],
};

const Template = (args: Object): Node => {
    (Template.args: any)
    const recordOnSiteSelect = action("onSiteSelect")
    const [selectedSite, setSelectedSite] = useState(null)
    return (
        <SitesMap
            {...args}
            selectedSite={selectedSite}
            onSiteSelect={(site) => {
                setSelectedSite(site)
                recordOnSiteSelect(site)
            }}
        />
    )
}

export const OneSite: typeof Template = Template.bind({});
OneSite.args = {
    ...calculateSiteProps([
        ServiceFactory(fixtures.ixa),
    ]),
};

export const ThreeSites: typeof Template = Template.bind({});
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

export const NoSites: typeof Template = Template.bind({});
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
