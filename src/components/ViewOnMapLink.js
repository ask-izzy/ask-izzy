/* @flow */

import type {Node as ReactNode} from "React";
import React, {useEffect, useState} from "react";
import icons from "../icons";
import maps, {MapsApi} from "../maps";
import Link from "./base/Link";

type Props = {
    to: string
}

function ViewOnMapLink({to}: Props): ReactNode {

    const [mapApi, setMapApi] = useState<?MapsApi>(null);

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
                <icons.Map
                    className="big"
                    aria-hidden={true}
                />
                <span>Map view</span>
            </span>
            <icons.Chevron
                className="big"
                aria-hidden={true}
            />
        </Link>
    );
}

export default ViewOnMapLink
