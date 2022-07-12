/* @flow */
import {useState} from "react";

import Service from "@/src/iss/Service"

export default function(services: Array<Service>): {
    submitForm: ({string: any}) => Promise<string>,
    currentlySubmitting: boolean
} {
    const [currentlySubmitting, setCurrentlySubmitting] = useState(false)
    async function submitForm(data) {
        setCurrentlySubmitting(true)

        try {
            const body = JSON.stringify({
                ...data,
                services: services.map(service => service.id),
            })

            const res = await fetch('/api/share-services', {
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });

            if (res.status === 429) {
                throw Error("Rate limiting")
            } else if (res.status === 403) {
                throw Error("Abusive language")
            } else if (res.status < 200 || res.status >= 300) {
                throw Error()
            }
            return "Message is sent"

        } catch (error) {
            setCurrentlySubmitting(false)
            if (error.message === "Rate limiting") {
                return "Too many messages sent recently. Please wait a bit before sending a new message."
            } else if (error.message === "Abusive language") {
                return "Abusive language was detected. Message could not be sent."
            } else {
                return "Message failed"
            }
        }
    }

    return {
        submitForm,
        currentlySubmitting,
    }
}
