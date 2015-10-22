/* @flow */

import React from "react";
import { History } from "react-router";
import fixtures from "../../fixtures/services";
import reactMixin from "react-mixin";

import icons from "../icons";
import iss from "../iss";
import OpeningTimes from "./OpeningTimes";
import LinkListItem from "./LinkListItem";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class ResultListItem extends React.Component {

    // flow:disable not supported yet
    static displayName = "ResultListItem";

    // flow:disable not supported yet
    static propTypes = {
        object: React.PropTypes.instanceOf(iss.Service).isRequired,
        nServiceProvisions: React.PropTypes.number,
    };

    // flow:disable
    static defaultProps = {
        nServiceProvisions: 4,
    };

    // flow:disable not supported yet
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
        let {
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
            </LinkListItem>

        );
    }
}

export default ResultListItem;
