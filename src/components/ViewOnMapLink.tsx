import React, {useEffect, useState} from "react";

import Map from "@/src/icons/Map.js";
import maps, {MapsApi} from "@/src/maps.js";
import Link from "@/src/components/base/Link.js";


type Props = {
    to: string
}

function ViewOnMapLink({to}: Props) {

    const [mapApi, setMapApi] = useState<MapsApi | null>(null);

    useEffect(() => {
        const getMaps = async() => {
            const api = await maps()
            setMapApi(api)
        }
        getMaps()
    }, [])

    if (!mapApi) {
        return null
    }

    return (
        <Link
            className="ViewOnMapLink"
            to={to}
            analyticsEvent={{
                event: "Link Followed - Results Map",
                eventAction: "View results map",
                eventLabel: null,
            }}
        >
            <span className="label">
                <Map
                    className="big"
                    aria-hidden={true}
                />
                Map
            </span>
        </Link>
    );
}

export default ViewOnMapLink
