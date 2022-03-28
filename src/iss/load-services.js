/* @flow */
import {getIssClient, getIssVersion} from "../iss/client"
import {attachTransportTimes} from "./travelTimes"
import Service from "./Service"
import {
    createServiceSearch,
} from "../iss/serviceSearch"

export async function getService(
    serviceId: number
): Promise<Service> {
    const issClient = await getIssClient(getIssVersion())

    const serviceData = await issClient.getService(serviceId)

    serviceData.now_open = {
        local_time: "2022-01-18T16:41:00+11:00",
        notes: "",
        now_open: true,
    }
    serviceData.catchment = serviceData.catchment_description
    serviceData.location = {
        building: "",
        flat_unit: "",
        level: "",
        street_name: "",
        street_number: "",
        street_suffix: "",
        street_type: "",
        details: "",
        state: serviceData.site.location_state,
        postcode: serviceData.site.location_postcode,
        suburb: serviceData.site.location_suburb,
        point: serviceData.site.location_geo_point,
    }
    const service = new Service(serviceData);

    try {
        await attachTransportTimes([service]);
    } catch (error) {
        console.error("Unable to retrieve transport times")
        console.error(error);
    }

    return service;
}

export async function getSiblingServices(service: Service): Promise<Service[]> {
    // TODO get this working
    if (getIssVersion() === "4") {
        return []
    }
    const search = createServiceSearch({
        siteId: service.site.id,
        maxPageSize: 100,
    });
    await search.loadNextPage()
    const servicesAtSite = search.loadedServices

    // Exclude self from services at site
    const siblingServices = servicesAtSite.filter(
        serviceResult => serviceResult.id != service.id
    )

    return siblingServices
}
