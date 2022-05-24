/* @flow */

import type {Node as ReactNode} from "React";
import React, { useState } from "react";
import { action } from "@storybook/addon-actions";

import SitesMap from "./SitesMap";
import {
    ixaService,
    housingService,
} from "../../fixtures/services";
import getServiceFixture from "../../fixtures/factories/Service";
import { addGoogleMapsScript } from "../storybook/decorators";
import Service from "../iss/Service"

export default {
    title: "App Components/SitesMap",
    component: SitesMap,
    decorators: [addGoogleMapsScript],
};

const Template = (args: Object): ReactNode => {
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
        ixaService,
    ]),
};

export const ThreeSites: typeof Template = Template.bind({});
ThreeSites.args = {
    ...calculateSiteProps([
        ixaService,
        housingService,
        getServiceFixture({
            location: {
                suburb: "Geelong",
                point: {
                    lat: -38.1472,
                    lon: 144.3575,
                },
            },
        }),
    ]),
};

export const NoSites: typeof Template = Template.bind({});
NoSites.args = {
    ...calculateSiteProps([]),
};

function calculateSiteProps(services: Array<Service>) {
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
