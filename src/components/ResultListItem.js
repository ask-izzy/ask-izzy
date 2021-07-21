/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";
import PropTypes from "proptypes";
import fixtures from "../../fixtures/services";

import icons from "../icons";
import iss from "../iss";

import DebugContainer from "./DebugContainer";
import DebugQueryScore from "./DebugQueryScore";
import DebugServiceRecord from "./DebugServiceRecord";

import Eligibility from "./Eligibility";
import ServiceProvisions from "./service/ServiceProvisions"
import LinkListItem from "./LinkListItem";
import Accessibility from "./Accessibility";
import OpeningTimes from "./OpeningTimes";
import Ndis from "./Ndis";
import TransportTime from "./TransportTime";
import IndigenousServiceIcon from "./IndigenousServiceIcon";
import LgbtiqIcon from "./LgbtiqIcon";
import { titleize } from "underscore.string";
import ScreenReader from "./ScreenReader";

class ResultListItem extends React.Component<{
    service: iss.Service,
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
            <span className="location">
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
            <LinkListItem
                className="plain-text ResultListItem"
                to={`/service/${service.slug}`}
                rightIcon={<icons.Chevron />}
            >

                {this.renderLocation(service.Location())}
                <div className="name">
                    <h2>
                        {service.name}
                    </h2>
                    <div className="flags">
                        <IndigenousServiceIcon object={service} />
                        <LgbtiqIcon object={service} />
                    </div>
                </div>
                <div className="site_name">
                    {service.site.name}
                    <Ndis
                        className="ndis"
                        compact={true}
                        object={service}
                    />
                </div>

                <OpeningTimes
                    className="opening_hours"
                    object={service.open}
                />
                <ServiceProvisions
                    service={service}
                />
                <div className="description">
                    {service.shortDescription.map(
                        (sentence, i) =>
                            <p key={i}>{sentence}</p>
                    )}
                </div>
                <Eligibility {...service} />
                <Accessibility object={service} />
                <ScreenReader>
                    Travel times.
                </ScreenReader>
                <TransportTime
                    compact={true}
                    location={service.Location()}
                />

                <DebugServiceRecord object={service} />
                {service._explanation &&
                    <DebugContainer message="Query score">
                        <DebugQueryScore expl={service._explanation} />
                    </DebugContainer>
                }

                <span className="learnMore">
                    Learn More
                </span>
            </LinkListItem>

        );
    }
}

export default ResultListItem;
