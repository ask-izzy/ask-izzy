import React from "react"

import Collapser from "@/src/components/general/Collapser.js"
import Spacer from "@/src/components/Spacer.js"
import Email from "@/src/components/Email.js"
import PhoneButton from "@/src/components/PhoneButton.js"
import Web from "@/src/components/Web.js"
import * as gtm from "@/src/google-tag-manager.js"
import Service from "@/src/iss/Service.js"


type Props = {
    object: Service,
}

function ContactMethods({object}: Props) {
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

    function phones(): Array<any> {
        return object.Phones().map(details => ({
            type: "Phone",
            component: PhoneButton,
            details: {
                ...details,
                styleType: "hollow",
            },
        }))
    }

    function emails(): Array<any> {
        return (object.emails || []).map(details => ({
            type: "Email",
            component: Email,
            details,
        }))
    }

    function websites(): Array<any> {
        const url = object.web

        return url && [{
            type: "Website",
            component: Web,
            details: {url},
        }] || []
    }

    function foldExpandHandler(): void {
        gtm.emit({
            event: "Service Contact Details Expanded",
            eventCat: "Content Expanded",
            eventAction: "Service Contact Details",
            eventLabel: location.pathname,
            sendDirectlyToGA: true,
        })
    }

    function renderContactMethod(record: Record<string, any>, idx: number) {
        const props = Object.assign({
            key: idx,
            analyticsEventDetails: {
                event: "Service Contact Detail Clicked",
                eventCat: "Service Contact Detail Clicked",
                eventAction: `${record.type}`,
            },
        }, record.details)

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
                        onClick={foldExpandHandler}
                        analyticsEvent={{
                            event: "Action Triggered - " +
                                "Other Contact Details",
                            eventAction: "Show other contact details",
                            eventLabel: null,
                        }}
                    >
                        {contactsAfterFold().map(
                            renderContactMethod,
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
