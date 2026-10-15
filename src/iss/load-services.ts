import {getIssClient} from "../iss/client"
import {attachTransportTimes} from "./travelTimes"
import Service, {SERVICE_DETAIL_FIELDS} from "./Service"
import {
    createServiceSearch,
} from "../iss/serviceSearch"

export async function getService(
    serviceId: number
): Promise<Service> {
    const issClient = await getIssClient()

    const response = await issClient.getService(
        serviceId,
        SERVICE_DETAIL_FIELDS
    )
    const service = new Service(response);

    try {
        await attachTransportTimes([service]);
    } catch (error) {
        console.error("Unable to retrieve transport times")
        console.error(error);
    }

    return service;
}

export async function getSiblingServices(service: Service): Promise<Service[]> {
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
