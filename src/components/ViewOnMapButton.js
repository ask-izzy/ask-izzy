/* @flow */

import type {Node as ReactNode} from "React";
import React, {useEffect, useState} from "react";
import Map from "../icons/map.svg";
import Chevron from "../icons/chevron.svg";
import maps, {MapsApi} from "../maps";
import Button from "./base/Button";
import {useRouterContext} from "../contexts/router-context";

type Props = {
    to: string
}

function ViewOnMapButton({to}: Props): ReactNode {

    const [mapApi, setMapApi] = useState<?MapsApi>(null);

    const {navigate} = useRouterContext()

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
        <Button
            className="ViewOnMapButton"
            to={to}
            onClick={() => {
                navigate(to)
            }}
            analyticsEvent={{
                event: "Link Followed - Results Map",
                eventAction: "View results map",
                eventLabel: null,
            }}
        >
            <div className="buttonLabel">
                <div className="leftSide">
                    <Map className="big" />
                    <span>
                        Map view
                    </span>
                </div>
                <Chevron className="big" />
            </div>
        </Button>
    );
}

export default ViewOnMapButton
