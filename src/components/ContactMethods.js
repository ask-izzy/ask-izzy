/* @flow */

import React from "react";

import Collapser from "./Collapser";
import Spacer from "./Spacer";
import Email from "./Email";
import Phone from "./Phone";
import Web from "./Web";
import fixtures from "../../fixtures/services";
import ServiceFactory from "../../fixtures/factories/Service";
import * as gtm from "../google-tag-manager";

import type { Service } from "../iss";

type Props = {
    object: Service,
    expanded?: boolean
}

class ContactMethods extends React.Component<Props, void> {
    static sampleProps = {
        closed: {
            object: ServiceFactory({
                phones: fixtures.ixa.phones,
                emails: [],
                web: null,
            }),
            expanded: false,
        },
        open: {
            object: ServiceFactory({
                phones: fixtures.ixa.phones,
                emails: [],
                web: null,
            }),
            expanded: true,
        },
        "two numbers": {
            object: ServiceFactory({
                phones: [
                    {kind: "phone", number: "(03) 3333 3333"},
                    {kind: "phone", number: "(03) 5555 5555"},
                ],
                emails: [],
                web: null,
            }),
            expanded: false,
        },
    };

    get contacts(): Array<Service> {
        return this.foldContacts([0])
    }

    foldPoint = 1

    get contactsBeforeFold(): Array<Service> {
        return this.foldContacts([0, this.foldPoint])
    }

    get contactsAfterFold(): Array<Service> {
        return this.foldContacts([this.foldPoint])
    }

    foldContacts(foldIndices: Array<number>): Array<Service> {
        return [
            ...this.phones.slice(...foldIndices),
            ...this.emails.slice(...foldIndices),
            ...this.websites.slice(...foldIndices),
        ]
    }

    get phones(): Array<Object> {
        return this.props.object.Phones().map(details => ({
            type: "Phone",
            component: Phone,
            details,
        }))
    }

    get emails(): Array<Object> {
        return (this.props.object.emails || []).map(details => ({
            type: "Email",
            component: Email,
            details,
        }));
    }

    get websites(): Array<Object> {
        const url = this.props.object.web

        return url && [{
            type: "Website",
            component: Web,
            details: {url},
        }] || [];
    }

    foldExpandHandler(): void {
        gtm.emit({
            event: "Service Contact Details Expanded",
            eventCat: "Content Expanded",
            eventAction: "Service Contact Details",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        })
    }

    render() {
        if (this.contacts.length > 0) {
            /* render one contact method per type and
             * then put the rest in a collapser */
            return (
                <div className="ContactMethods">
                    <Spacer />
                    {this.contactsBeforeFold.map(this.renderContactMethod)}
                    {this.contactsAfterFold.length > 0 &&
                        <Collapser
                            message="Other contact options"
                            expanded={this.props.expanded}
                            onClick={this.foldExpandHandler}
                        >
                            {this.contactsAfterFold.map(
                                this.renderContactMethod
                            )}
                        </Collapser>
                    }
                </div>
            );

        } else {
            return <span />;
        }
    }

    renderContactMethod(record: Object, idx: number) {
        const props = Object.assign({
            key: idx,
            analyticsEventDetails: {
                event: "Service Contact Detail Clicked",
                eventCat: "Service Contact Detail Clicked",
                eventAction: `${record.type}`,
            },
        }, record.details);

        return React.createElement(record.component, props);
    }
}

export default ContactMethods;
