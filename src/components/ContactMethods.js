/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import Collapser from "./general/Collapser";
import Spacer from "./Spacer";
import Email from "./Email";
import PhoneButton from "./PhoneButton";
import Web from "./Web";
import Service from "../iss/Service";

type Props = {
    object: Service,
    externalCollapsed?: boolean,
    onToggle?: (isCollapsed: boolean) => void,
};

function ContactMethods({ object, externalCollapsed, onToggle }: Props): ReactNode {

    function phones(): Array<Object> {
        return object.Phones().map((details, idx) => ({
            type: "Phone",
            component: PhoneButton,
            details: {
                ...details,
                styleType: idx > 0 ? "link" : "solid",
            },
        }));
    }

    function emails(): Array<Object> {
        return (object.emails || []).map(details => ({
            type: "Email",
            component: Email,
            details,
        }));
    }

    function websites(): Array<Object> {
        const url = object.web;

        return url ? [{
            type: "Website",
            component: Web,
            details: { url },
        }] : [];
    }

    function renderContactMethod(record: Object, idx: number): ReactNode {
        const props = {
            key: idx,
            ...record.details,
        };

        return React.createElement(record.component, props);
    }

    const phoneNumbers = phones();
    const mainPhoneNumber = phoneNumbers.slice(0, 1);
    const extraPhoneNumbers = phoneNumbers.slice(1);

    return (
        <div className="ContactMethods">
            {/* Spacer and Main phone number */}
            {mainPhoneNumber.length > 0 && (
                <>
                    <Spacer />
                    {mainPhoneNumber.map(renderContactMethod)}
                </>
            )}

            {/* Collapser for extra phone numbers */}
            {extraPhoneNumbers.length > 0 && (
                <>
                    <Collapser
                        expandMessage="Show other contact options"
                        collapseMessage="Hide other contact options"
                        analyticsEvent={{
                            event: "Action Triggered - Other Contact Details",
                            eventAction: "Show other contact details",
                            eventLabel: null,
                        }}
                        externalCollapsed={externalCollapsed}
                        onToggle={onToggle}
                    >
                        {extraPhoneNumbers.map(renderContactMethod)}
                    </Collapser>
                </>
            )}

            {/* Spacer before Email */}
            {emails().length > 0 && <Spacer />}

            {/* Email */}
            {emails().map(renderContactMethod)}

            {/* Website */}
            {websites().map(renderContactMethod)}
        </div>
    );
}

export default ContactMethods;
