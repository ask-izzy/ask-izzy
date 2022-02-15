/* @flow */
import Service from "../services/Service"

export function countCrisisResults(results: Array<Service>): number {
    const firstRegularServiceIdx = results.findIndex(
        ({crisis}) => !crisis
    )

    if (firstRegularServiceIdx === -1) {
        // No regular services found; everything is a crisis service
        return results.length
    } else {
        // Anything after the first regular service is not a crisis result
        return firstRegularServiceIdx;
    }
}

export function crisisResults(results: Array<Service>): Array<Service> {
    return results.slice(
        0,
        countCrisisResults(results)
    );
}

export function nonCrisisResults(results: Array<Service>): Array<Service> {
    return results.slice(
        countCrisisResults(results),
        results.length
    )
}
