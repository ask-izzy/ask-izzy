/* @flow */
import {useState} from "react"
import storage from "../storage";
import Service from "../services/Service"
import {
    attachTransportTimes,
    removeAllTransitTimes,
} from "../services/travelTimes"

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
            storage.getUserGeolocation() ?
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
