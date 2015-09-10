/* @flow */

"use strict";

import React from "react";
import mui from "material-ui";
import _ from "underscore";

import Address from "../components/Address";
import CollapsedPhones from "../components/CollapsedPhones";
import Eligibility from "../components/Eligibility";
import OpeningTimes from "../components/OpeningTimes";
import colors from "../constants/theme";
import fixtures from "../../fixtures/services";
import serviceProvisions from "../constants/service-provisions";

var palette = colors.getPalette();

export default class ServicePane extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {default: {service: fixtures.youthSupportNet}};

    // flow:disable
    get description(): string {
        return this.props.service.description.split('.', 1)[0] + '.';
    }

    /**
     * serviceProvisions:
     *
     * An array of things this service provides built using a bucket-of-words
     * approach from the service's full description */
    /* flow:disable */
    get serviceProvisions(): Array<string> {
        if (this._serviceProvisions) {
            return this._serviceProvisions;
        }

        var service = this.props.service;
        this._serviceProvisions = [];

        for (var provision of serviceProvisions) {
            var forms = [provision.cname].concat(provision.forms || []);

            if (_.some(forms.map(form => new RegExp(form, 'i')),
                       form => service.description.match(form))) {
                this._serviceProvisions.push(provision.cname);
            }
        }

        return this._serviceProvisions;
    }

    render(): React.Element {
        var object = this.props.service;
        var phones = _.filter(object.phones, (p) => p.kind != 'fax');
        var phoneOrder = ['freecall', 'phone', 'mobile'];
        phones = _(phones).sortBy((p) => phoneOrder.indexOf(p.kind));

        return (
            <div className="ServicePane">
                <main>
                    <h2 className="name">{object.name}</h2>
                    <h3 className="description">
                        {this.description}
                    </h3>

                    <hr />

                    <OpeningTimes object={object} />
                    <hr />
                    <Address {...object.location} />
                    <hr />
                    <CollapsedPhones phones={phones} />
                </main>

                <Eligibility
                    catchment={object.catchment}
                    eligibility_info={object.eligibility_info}
                    ineligibility_info={object.ineligibility_info}
                />

                <h2>What you can get here</h2>
                <ul>
                    {this.serviceProvisions.map(
                        (provision, index) => <li key={index}>{provision}</li>
                    )}
                </ul>
            </div>
        );
    }

}
