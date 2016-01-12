/* @flow */

import React from "react";
import { History } from "react-router";
import fixtures from "../../fixtures/services";
import reactMixin from "react-mixin";

import icons from "../icons";
import iss from "../iss";

import DebugContainer from "./DebugContainer";
import DebugQueryScore from "./DebugQueryScore";
import OpeningTimes from "./OpeningTimes";
import LinkListItem from "./LinkListItem";
import TransportTime from "./TransportTime";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class ResultListItem extends React.Component {

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
    /* flow:disable */
    get nMoreServiceProvisions(): number {
        return Math.max(0,
                        this.props.object.serviceProvisions.length -
                            this.props.nServiceProvisions);
    }

    render(): ReactElement {
        const {
            object,
        } = this.props;

        return (
            <LinkListItem
                className="plain-text ResultListItem"
                to={`/service/${object.slug}`}
                rightIcon={<icons.Chevron />}
            >
                <h2 className="name">{object.name}</h2>
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
                <DebugContainer>
                    <DebugQueryScore expl={object._explanation} />
                </DebugContainer>
            </LinkListItem>

        );
    }
}

export default ResultListItem;
