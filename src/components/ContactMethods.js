/* @flow */

import type {Node as ReactNode} from "React"
import React from "react"

import Collapser from "./general/Collapser"
import Spacer from "./Spacer"
import Email from "./Email"
import PhoneButton from "./PhoneButton"
import Web from "./Web"

import Service from "../iss/Service"

type Props = {
    object: Service,
}

function ContactMethods({object}: Props): ReactNode {
    const foldPoint = 1

    function contacts(): Array<Service> {
        return foldContacts([0])
    }

    function contactsBeforeFold(): Array<Service> {
        return foldContacts([0, foldPoint])
    }

    function contactsAfterFold(): Array<Service> {
        return foldContacts([foldPoint])
    }

    function foldContacts(foldIndices: Array<number>): Array<Service> {
        return [
            ...phones().slice(...foldIndices),
            ...emails().slice(...foldIndices),
            ...websites().slice(...foldIndices),
        ]
    }

    function phones(): Array<Object> {
        return object.Phones().map(details => ({
            type: "Phone",
            component: PhoneButton,
            details: {
                ...details,
                styleType: "hollow",
            },
        }))
    }

    function emails(): Array<Object> {
        return (object.emails || []).map(details => ({
            type: "Email",
            component: Email,
            details,
        }))
    }

    function websites(): Array<Object> {
        const url = object.web

        return url && [{
            type: "Website",
            component: Web,
            details: {url},
        }] || []
    }

    function renderContactMethod(record: Object, idx: number): ReactNode {
        const props = {
            key: idx,
            ...record.details,
        }

        return React.createElement(record.component, props)
    }


    if (contacts().length > 0) {
        /* render one contact method per type and
            * then put the rest in a collapser */
        return (
            <div className="ContactMethods">
                <Spacer />
                {contactsBeforeFold().map(renderContactMethod)}
                {contactsAfterFold().length > 0 &&
                    <Collapser
                        expandMessage="Show other contact options"
                        analyticsEvent={{
                            event: "Action Triggered - " +
                                "Other Contact Details",
                            eventAction: "Show other contact details",
                            eventLabel: null,
                        }}
                    >
                        {contactsAfterFold().map(
                            renderContactMethod
                        )}
                    </Collapser>
                }
            </div>
        )
    } else {
        return <span />
    }
}

export default ContactMethods
