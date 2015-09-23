/* @flow */

import React from "react";
import Router from "react-router";
import mui from "material-ui";
import _ from "underscore";

import Address from "../components/Address";
import CollapsedOpeningTimes from "../components/CollapsedOpeningTimes";
import ContactMethods from "../components/ContactMethods";
import Eligibility from "../components/Eligibility";
import TransportTime from "../components/TransportTime";
import fixtures from "../../fixtures/services";
import icons from "../icons";
import iss from "../iss";

export default class ServicePane extends React.Component {

    constructor(props: Object) {
        super(props);
        this.state = {
            siblings: null,
        };
    }

    componentDidMount(): void {
        this.getSiblingServices();
    }

    componentDidUpdate(prevProps: Object, prevState: Object): void {
        if (prevProps.service != this.props.service) {
            this.getSiblingServices();
        }
    }

    // flow:disable not supported yet
    static sampleProps = {default: {
        service: new iss.Service(fixtures.youthSupportNet),
    }};

    async getSiblingServices(): Promise<void> {
        var response = await this.props.service.getSiblingServices();

        this.setState({siblings: response.objects});
    }

    render(): ReactElement {
        var object = this.props.service;

        return (
            <div className="ServicePane">
                <main>
                    <h2 className="name">{object.name}</h2>
                    <h3 className="description">
                        {object.shortDescription}
                    </h3>

                    <hr />

                    <CollapsedOpeningTimes object={object.open} />
                    <hr />
                    <Address {...object.location} />
                    <hr />
                    {!object.isConfidential ?
                         <div>
                             <TransportTime object={object} />
                             <hr />
                        </div>
                     : ""}
                    <ContactMethods object={object} />
                </main>

                <Eligibility
                    catchment={object.catchment}
                    eligibility_info={object.eligibility_info}
                    ineligibility_info={object.ineligibility_info}
                />

                {this.renderServiceProvisions()}
                {this.renderSiblings()}
            </div>
        );
    }

    renderServiceProvisions(): ReactElement {
        var object = this.props.service;

        if (_.isEmpty(object.serviceProvisions)) {
            return <div />;
        }

        return (
            <div className="padded">
                <h3 className="serviceProvisions-header">
                    What you can get here
                </h3>
                <ul>
                    {object.serviceProvisions.map(
                        (provision, index) =>
                        <li key={index}>{provision}</li>
                    )}
                </ul>
            </div>
        );
    }

    renderSiblings(): ReactElement {
        if (_.isEmpty(this.state.siblings)) {
            return <span />;
        }

        return (
            <div className="siblings">
                <h3 className="padded">
                    Also at this location
                </h3>
                <mui.List className="List">
                    {this.state.siblings.map((service, index) =>
                        <mui.ListItem className="ListItem"
                            key={index}
                            primaryText={service.name}
                            secondaryText={service.shortDescription}
                            containerElement={
                                <Router.Link
                                    to="service"
                                    params={{slug: service.slug}}
                                />
                            }

                            rightIcon={
                                <icons.Chevron />
                            }

                            disableFocusRipple={true}
                            disableTouchRipple={true}
                        />
                    )}
                </mui.List>
            </div>
        );
    }
}
