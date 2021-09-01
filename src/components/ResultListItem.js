/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";
import PropTypes from "proptypes";
import fixtures from "../../fixtures/services";

import icons from "../icons";
import iss from "../iss";

import Eligibility from "./Eligibility";
import OpeningTimes from "./OpeningTimes";
import Ndis from "./Ndis";
import { titleize } from "underscore.string";
import Link from "./base/Link";

class ResultListItem extends React.Component<{
    service: iss.Service,
    resultNumber: number
}, void> {
    static displayName: ?string = "ResultListItem";

    static propTypes = {
        service: PropTypes.instanceOf(iss.Service).isRequired,
    };

    static sampleProps: any = {default: {
        service: new iss.Service(fixtures.ixa),
    }};

    renderLocation(location: Object): ReactElement<"span"> {

        let suburb = location.suburb;

        if (location.isConfidential()) {
            suburb = "Confidential location";
        }

        return (
            <span
                className="location"
                aria-label={`${suburb}.`}
            >
                <icons.Map
                    aria-label="Location"
                />
                {titleize(suburb)}
            </span>
        );
    }

    render(): ReactNode {
        const {
            service,
        } = this.props;

        return (
            <div className="result supportService ResultListItem"
                key={service.id}
            >
                <h3 className="name">
                    <Link
                        className="title"
                        to={`/service/${service.slug}`}
                        analyticsEvent={{
                            event: `Link Followed - Service Result`,
                            eventAction: "Service result",
                            eventLabel: `Standard service - number ` +
                                `${this.props.resultNumber}`,
                        }}
                    >
                        {service.name}
                    </Link>
                </h3>
                <h4 className="site_name">
                    {service.site.name}
                    <Ndis
                        className="ndis"
                        compact={true}
                        object={service}
                    />
                </h4>
                <OpeningTimes
                    className="opening_hours"
                    object={service.open}
                    compact={true}
                />
                <div className="description">
                    {service.shortDescription.map(
                        (sentence, idx) =>
                            <p key={idx}>{sentence}</p>
                    )}
                </div>
                <Eligibility {...service} />
                <Link
                    className="learnMore"
                    to={`/service/${service.slug}`}
                >
                    Learn More
                </Link>
            </div>

        );
    }
}

export default ResultListItem;
