/* @flow */

import type {Element as ReactElement} from "React";
import React from "react";
import moment from "moment-timezone";

import ServiceOpening from "../services/ServiceOpening";
import ScreenReader from "./ScreenReader";

import icons from "../icons";

type Props = {
    moment?: Moment,
    object: ServiceOpening,
}

class OpeningTimes extends React.Component<Props, void> {
    static defaultProps: any = {
        moment: moment,
    };

    render(): ReactElement<"div"> {
        let open = this.props.object.now_open;
        let renderMethod: ?Function;

        if (open === true) {
            renderMethod = this.renderOpen;
        } else if (open === false) {
            renderMethod = this.renderClosed;
        } else {
            renderMethod = this.renderUnsure;
        }

        return (
            <div className="OpeningTimes">
                <icons.Clock
                    className="ColoredIcon"
                    aria-hidden={true}
                />
                <ScreenReader>
                    Service is currently
                </ScreenReader>
                {renderMethod.apply(this)}
            </div>
        );

    }

    /*
     * Render the opening hours if ISS says it's open
     */
    renderOpen(): ReactElement<"span"> {
        return (
            <span className="until">
                <span className="open">
                    Open now
                </span>
                {" "}
                <span className="time">
                    {this.props.object.until}
                </span>
            </span>
        );
    }

    /*
     * Render the opening hours if ISS says it's closed
     */
    renderClosed(): ReactElement<"span"> {
        return (
            <span className="until">
                <span className="closed">
                    Closed
                </span>
                {" "}
                <span className="time">
                    {this.props.object.until}
                </span>
            </span>
        );
    }

    /*
     * Render the opening hours if ISS isn't sure whether
     * the place is currently open.
     */
    renderUnsure(): ReactElement<"span"> {
        const openTime = this.props.object.nextOpeningTimes;

        if (!openTime) {
            return (
                <span className="until">
                    Contact for opening hours.
                </span>
            );
        }

        const start = this.props.object.ifTime`from ${openTime.start}`;
        const end = this.props.object.ifTime`until ${openTime.end}`;

        return (
            <span className="until">
                {openTime.day} {start} {end}
                {openTime.note && ` (${openTime.note})`}
            </span>
        );
    }
}

export default OpeningTimes;
