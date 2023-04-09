import {getIssClient, getIssVersion} from "@/src/iss/client.js"
import {attachTransportTimes} from "@/src/iss/travelTimes.js"
import Service from "@/src/iss/Service.js"
import {
    createServiceSearch,
} from "@/src/iss/serviceSearch.js"


export async function getService(
    serviceId: number,
): Promise<Service> {
    const issClient = await getIssClient(getIssVersion() as any)

    const response = await issClient.getService(serviceId)
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
        serviceResult => serviceResult.id != service.id,
    )

    return siblingServices
}
