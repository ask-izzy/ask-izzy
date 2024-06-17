/* @flow */
import moment from "moment-timezone";
import * as React from "react";
import _ from "underscore";
import Service from "../iss/Service";
import Spacer from "./Spacer";
import icons from "../icons"


type Props = {
    service : Service,
    withSpacer?: boolean,
    withIcon?: boolean,
};

function formatTime(str: string): string {
    return moment(str, "HH:mm:ss").format("h:mm A");
}

function OpeningTimesList({ service, withSpacer = false, withIcon = false}: Props): React.Node {
    const order = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Public Holiday",
    ];

    let openingHours = _(service.open.openingTimes)
        .sortBy(record => order.indexOf(record.day) * 24 + parseInt(record.open));

    return <>
        {withSpacer && <Spacer />}
        {withIcon && <icons.Clock />}
        <ul className="OpeningTimesList">
            {openingHours.map((record, idx) => (
                <li key={idx}>
                    <span className="day">{record.day}</span>{" "}
                    <span className="time">
                        {formatTime(record.open)} &ndash; {formatTime(record.close)}
                    </span>
                </li>
            ))}
        </ul>
     </>;
}

export default OpeningTimesList;
