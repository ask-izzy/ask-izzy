/* @flow */

import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "proptypes";
import fixtures from "../../fixtures/services";

import icons from "../icons";
import iss from "../iss";

import Eligibility from "../components/Eligibility";
import OpeningTimes from "./OpeningTimes";
import Ndis from "./Ndis";
import * as gtm from "../google-tag-manager";
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
            <div className="result supportService ResultListItem"
                key={object.id}
            >
                <h3 className="name">
                    <Link
                        className="title"
                        to={`/service/${object.slug}`}
                    >
                        {object.name}
                    </Link>
                </h3>
                <h4 className="site_name">
                    {object.site.name}
                    <Ndis
                        className="ndis"
                        compact={true}
                        object={object}
                    />
                </h4>
                <OpeningTimes
                    className="opening_hours"
                    object={object.open}
                    compact={true}
                />
                <div className="description">
                    {object.shortDescription.map(
                        (sentence, idx) =>
                            <p key={idx}>{sentence}</p>
                    )}
                </div>
                <Eligibility {...object} />
                <Link
                    className="learnMore"
                    to={`/service/${object.slug}`}
                >
                    Learn More
                </Link>
            </div>
        );
    }
}

export default ResultListItem;
