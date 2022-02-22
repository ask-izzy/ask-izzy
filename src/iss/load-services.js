/* @flow */
import {getIss3Client} from "./client"
import {attachTransportTimes} from "./travelTimes"
import Service from "./Service"

export async function getService(
    serviceId: number
): Promise<Service> {
    const issClient = await getIss3Client()

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
    const issClient = await getIss3Client()

    const result = await issClient.search({
        site_id: service.site.id,
        limit: 100,
    });

    if (!result) {
        // We currently don't worry about if sibling services fail to load
        return []
    }
    const {objects: servicesAtSite} = result

    // Exclude self from services at site
    const siblingServices = servicesAtSite.filter(
        serviceResult => serviceResult.id != service.id
    )

    return siblingServices.map(service => new Service(service));
}
