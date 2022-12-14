import React, { useState, ReactNode} from "react";
import { action } from "@storybook/addon-actions";

import SitesMap from "@/src/components/SitesMap";
import { ixaService, housingService } from "@/fixtures/services";
import getServiceFixture from "@/fixtures/factories/Service";
import { addGoogleMapsScript } from "@/src/storybook/decorators";
import Service from "@/src/iss/Service";

export default {
    title: "App Components/SitesMap",
    component: SitesMap,
    decorators: [addGoogleMapsScript]
};

const Template = (args): ReactNode => {
    const recordOnSiteSelect = action("onSiteSelect");
    const [selectedSite, setSelectedSite] = useState<any>(null);
    return (
        <SitesMap
            {...args}
            selectedSite={selectedSite}
            onSiteSelect={
                site => {
                    setSelectedSite(site);
                    recordOnSiteSelect(site);
                }
            }
        />
    )
};

export const OneSite = Template.bind({});
OneSite.args = { ...calculateSiteProps([ixaService])
};
export const ThreeSites = Template.bind({});
ThreeSites.args = { ...calculateSiteProps([ixaService, housingService, getServiceFixture({
    location: {
        suburb: "Geelong",
        point: {
            lat: -38.1472,
            lon: 144.3575
        }
    }
})])
};
export const NoSites = Template.bind({});
NoSites.args = { ...calculateSiteProps([])
};

function calculateSiteProps(services: Array<Service>) {
    const sites: any = [];
    const siteLocations = {};

    for (const {
        site,
        location
    } of services) {
        const id = site.id.toString();

        if (!siteLocations[id]) {
            sites.push(site);
            siteLocations[id] = location;
        }
    }

    return {
        sites,
        siteLocations
    };
}