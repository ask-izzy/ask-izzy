/* @flow */

import React from "react";
import Router from "react-router";
import mui from "material-ui";

import Address from "../components/Address";
import CollapsedOpeningTimes from "../components/CollapsedOpeningTimes";
import ContactMethods from "../components/ContactMethods";
import Eligibility from "../components/Eligibility";
import fixtures from "../../fixtures/services";
import icons from "../icons";
import iss from "../iss";

export default class ServicePane extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        service: React.PropTypes.instanceOf(iss.Service).isRequired,
    };

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
        service: Object.assign(
            new iss.Service(),
            fixtures.youthSupportNet
        )},
    };

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
                    <ContactMethods object={object} />
                </main>

                <Eligibility
                    catchment={object.catchment}
                    eligibility_info={object.eligibility_info}
                    ineligibility_info={object.ineligibility_info}
                />

                <div className="padded">
                    <h3>What you can get here</h3>
                    <ul>
                        {object.serviceProvisions.map((provision, index) =>
                            <li key={index}>{provision}</li>
                        )}
                    </ul>
                </div>

                {this.renderSiblings()}
            </div>
        );
    }

    renderSiblings(): React.Element {
        if (!this.state.siblings) {
            return "";
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
