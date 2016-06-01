/* @flow */

import React from "react";
import fixtures from "../../fixtures/services";

import icons from "../icons";
import iss from "../iss";

import DebugContainer from "./DebugContainer";
import DebugQueryScore from "./DebugQueryScore";
import DebugServiceRecord from "./DebugServiceRecord";

import LinkListItem from "./LinkListItem";
import OpeningTimes from "./OpeningTimes";
import TransportTime from "./TransportTime";
import sendEvent from "../google-tag-manager";
import IndigenousServiceIcon from "./IndigenousServiceIcon";

class ResultListItem extends React.Component {
    props: Object;
    state: Object;

    static displayName = "ResultListItem";

    static propTypes = {
        object: React.PropTypes.instanceOf(iss.Service).isRequired,
        nServiceProvisions: React.PropTypes.number,
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
        sendEvent({
            event: "listing",
            listingName: this.props.object.name,
            crisis: this.props.object.crisis,
        });
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
                <h2 className="name">
                    <IndigenousServiceIcon object={object} />
                    {object.name}
                </h2>
                <div className="site_name">{object.site.name}</div>
                <OpeningTimes
                    className="opening_hours"
                    object={object.open}
                />
                <TransportTime
                    compact={true}
                    location={object.Location()}
                />
                {this.props.nServiceProvisions > 0 ?
                    <div>
                        <ul className="related">{
                            object.serviceProvisions
                                .slice(0, this.props.nServiceProvisions)
                                .map((service, index) =>
                                    <li className="provision"
                                        key={index}
                                    >
                                        {service}
                                    </li>
                                )
                        }</ul>

                        {this.nMoreServiceProvisions > 0 ?
                            <div>
                                {this.nMoreServiceProvisions} more…
                            </div>
                        : ""}
                    </div>
                : ""}

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
