/* @flow */

import React from "react";
import PropTypes from "proptypes";
import fixtures from "../../fixtures/services";

import icons from "../icons";
import iss from "../iss";

import DebugContainer from "./DebugContainer";
import DebugQueryScore from "./DebugQueryScore";
import DebugServiceRecord from "./DebugServiceRecord";

import LinkListItem from "./LinkListItem";
import Accessibility from "./Accessibility";
import OpeningTimes from "./OpeningTimes";
import Ndis from "./Ndis";
import TransportTime from "./TransportTime";
import * as gtm from "../google-tag-manager";
import IndigenousServiceIcon from "./IndigenousServiceIcon";
import LgbtiqIcon from "./LgbtiqIcon";
import { titleize } from "underscore.string";

class ResultListItem extends React.Component<{
    object: iss.Service,
    nServiceProvisions: number,
}, void> {
    static displayName = "ResultListItem";

    static propTypes = {
        object: PropTypes.instanceOf(iss.Service).isRequired,
        nServiceProvisions: PropTypes.number,
    };

    static defaultProps = {
        nServiceProvisions: 4,
    };

    static sampleProps = {default: {
        object: new iss.Service(fixtures.ixa),
    }};

    /**
     * nMoreServiceProvisions:
     * The number of related services minus the 4 relatedServices.
     */
    get nMoreServiceProvisions(): number {
        return Math.max(0,
            this.props.object.serviceProvisions.length -
                            this.props.nServiceProvisions);
    }

    recordViewDetail(): void {
        gtm.emit({
            event: "listing",
            listingName: this.props.object.name,
            crisis: this.props.object.crisis,
        });
    }

    renderLocation(location: Object) {

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

    render() {
        const {
            object,
        } = this.props;

        return (
            <LinkListItem
                className="plain-text ResultListItem"
                to={`/service/${object.slug}`}
                rightIcon={<icons.Chevron />}
                onClick={this.recordViewDetail.bind(this)}
            >

                {this.renderLocation(object.Location())}

                <h2 className="name">
                    {object.name}
                </h2>
                <div className="site_name">
                    {object.site.name}
                    <Ndis
                        className="ndis"
                        compact={true}
                        object={object}
                    />
                </div>

                <OpeningTimes
                    className="opening_hours"
                    object={object.open}
                />
                <Accessibility object={object} />
                <TransportTime
                    compact={true}
                    location={object.Location()}
                />

                <IndigenousServiceIcon object={object} />
                <LgbtiqIcon object={object} />
                {this.props.nServiceProvisions > 0 && (
                    <div>
                        <ul className="related">
                            {object.serviceProvisions
                                .slice(0, this.props.nServiceProvisions)
                                .map((service, index) =>
                                    <li className="provision"
                                        key={index}
                                    >
                                        {service}
                                    </li>
                                )
                            }
                        </ul>

                        {this.nMoreServiceProvisions > 0 && (
                            <div>
                                {this.nMoreServiceProvisions} more…
                            </div>
                        )}
                    </div>
                )}

                <DebugServiceRecord object={object} />
                {object._explanation &&
                    <DebugContainer message="Query score">
                        <DebugQueryScore expl={object._explanation} />
                    </DebugContainer>
                }
            </LinkListItem>

        );
    }
}

export default ResultListItem;
