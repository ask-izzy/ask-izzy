/* @flow */

import type {Node as ReactNode, Element as ReactElement} from "React";
import React from "react";

import Collapser from "./general/Collapser";
import Spacer from "./Spacer";
import Email from "./Email";
import PhoneButton from "./PhoneButton";
import Web from "./Web";
import * as gtm from "../google-tag-manager";

import Service from "../services/Service";

type Props = {
    object: Service,
}

class ContactMethods extends React.Component<Props, void> {
    get contacts(): Array<Service> {
        return this.foldContacts([0])
    }

    foldPoint: number = 1

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
            component: PhoneButton,
            details: {
                ...details,
                styleType: "hollow",
            },
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

    render(): ReactElement<"div"> | ReactElement<"span"> {
        if (this.contacts.length > 0) {
            /* render one contact method per type and
             * then put the rest in a collapser */
            return (
                <div className="ContactMethods">
                    <Spacer />
                    {this.contactsBeforeFold.map(this.renderContactMethod)}
                    {this.contactsAfterFold.length > 0 &&
                        <Collapser
                            expandMessage="Show other contact options"
                            onClick={this.foldExpandHandler}
                            analyticsEvent={{
                                event: "Action Triggered - " +
                                    "Other Contact Details",
                                eventAction: "Show other contact details",
                                eventLabel: null,
                            }}
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

    renderContactMethod(record: Object, idx: number): ReactNode {
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
