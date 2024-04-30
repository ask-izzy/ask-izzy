/* @flow */
import type {Node as ReactNode} from "React"
import React from "react";
import Collapser from "./general/Collapser";
import Spacer from "./Spacer";
import Email from "./Email";
import PhoneButton from "./PhoneButton";
import Web from "./Web";
import Service from "../iss/Service";

type Props = {
    object: Service,
}

function ContactMethods({object}: Props): ReactNode {

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
            details: {url},
        }] : [];
    }

    function renderContactMethod(record: Object, idx: number): ReactNode {
        const props = {
            key: idx,
            ...record.details,
        };

        return React.createElement(record.component, props);
    }

    return (
        <div className="ContactMethods">
            <Spacer/>

            {/* Main phone number */}
            {phones().slice(0, 1).map(renderContactMethod)}

            {/* Collapser for extra phone numbers */}
            <Collapser
                expandMessage="Show other contact options"
                analyticsEvent={{
                    event: "Action Triggered - Other Contact Details",
                    eventAction: "Show other contact details",
                    eventLabel: null,
                }}
            >
                {phones().slice(1).map(renderContactMethod)}
            </Collapser>

            {/* Spacer before Email */}            
            <Spacer/>

            {/* Email */}
            {emails().map(renderContactMethod)}

            {/* Website */}
            {websites().map(renderContactMethod)}
        </div>
    );
}

export default ContactMethods;
