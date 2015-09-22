/* @flow */

import React from "react";
import _ from "underscore";

import Collapser from "./Collapser";
import Email from "./Email";
import Phone from "./Phone";
import Web from "./Web";
import fixtures from "../../fixtures/services";

class ContactMethods extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {
        default: {
            object: {
                phones: fixtures.ixa.phones,
                emails: [],
                web: null,
                expanded: false,
            },
        },
        open: {
            object: {
                phones: fixtures.ixa.phones,
                emails: [],
                web: null,
                expanded: true,
            },
        },
        "two numbers": {
            object: {
                phones: [
                    {kind: "phone", number: "(03) 3333 3333"},
                    {kind: "phone", number: "(03) 5555 5555"},
                ],
                emails: [],
                web: null,
            },
        },
    };

    render(): ReactElement {
        var {
            phones,
            emails,
            web,
        } = this.props.object;

        var filteredPhoneKinds = new Set(["fax", "tty"]);
        var phoneOrder = ["freecall", "phone", "mobile"];

        phones = _.filter(phones, p => !filteredPhoneKinds.has(p.kind));
        phones = _(phones).sortBy(p => phoneOrder.indexOf(p.kind));
        phones = _(phones).uniq(p => p.number);

        var contacts = [].concat(
            phones.map(phone => Object.assign({ component: Phone }, phone)),
            emails.map(email => Object.assign({ component: Email }, email)),
        );

        if (web) {
            contacts.push({ component: Web, url: web });
        }

        if (contacts.length > 2) {
            /* render one contact method and then put the rest in a
             * collapser */
            return (
                <div className="ContactMethods">
                    {this.renderContactMethod(_.first(contacts), 0)}
                    <Collapser
                        message="Other contact options"
                        expanded={this.props.expanded}
                    >
                        {_.rest(contacts).map(this.renderContactMethod)}
                    </Collapser>
                </div>
            );

        } else if (contacts.length > 0) {
            /* render 2 contact methods */
            return (
                <div className="ContactMethods">
                    {contacts.map(this.renderContactMethod)}
                </div>
            );
        } else {
            return <span />;
        }

    }

    renderContactMethod(record: Object, idx: number): React.Element {
        Object.assign(record, {key: idx});
        return React.createElement(record.component, record);
    }
}

export default ContactMethods;
