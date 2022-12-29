import {useState} from "react"
import storage from "@/src/storage.js";
import Service from "@/src/iss/Service.js"
import {
    attachTransportTimes,
    removeAllTransitTimes,
} from "@/src/iss/travelTimes.js"

type returnVals = {
    travelTimesStatus: travelTimesStatus,
    loadTravelTimes: () => Promise<void>,
    clearTravelTimes: () => void,
}

export type travelTimesStatus = "not set" | "loading" | "loaded"

export default function useTravelTimesUpdater(
    services: Array<Service>,
): returnVals {
    const [travelTimesStatus, setTravelTimesStatus] =
        useState<travelTimesStatus>(
            storage.getUserGeolocation() ?
                "loaded"
                : "not set",
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
