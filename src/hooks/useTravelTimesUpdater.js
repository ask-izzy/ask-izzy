/* @flow */
import {useState} from "react"
import storage from "../storage";
import Service from "../iss/Service"
import {
    attachTransportTimes,
    removeAllTransitTimes,
} from "../iss/travelTimes"

type returnVals = {
    travelTimesStatus: travelTimesStatus,
    loadTravelTimes: () => Promise<void>,
    clearTravelTimes: () => void,
}

export type travelTimesStatus = "not set" | "loading" | "loaded"

export default function useTravelTimesUpdater(
    services: Array<Service>
): returnVals {
    const [travelTimesStatus, setTravelTimesStatus] =
        useState<travelTimesStatus>(
            storage.getLocation() ?
                "loaded"
                : "not set"
        )
    async function loadTravelTimes() {
        setTravelTimesStatus("loading")
        await attachTransportTimes(services)
        setTravelTimesStatus("loaded")
    }
    function clearTravelTimes() {
        setTravelTimesStatus("not set")
        removeAllTransitTimes()
    }
    return {
        travelTimesStatus,
        loadTravelTimes,
        clearTravelTimes,
    }
}
