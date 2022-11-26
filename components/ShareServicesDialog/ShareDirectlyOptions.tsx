import React, {useState, useEffect} from "react";

import isMounted from "@/hooks/useIsMounted"
import StandardButton from "@/components/general/StandardButton"
import Service from "@/src/iss/Service"
import useToastMessage from "@/hooks/useToastMessage"
import * as gtm from "@/src/google-tag-manager";
import {CopyToClipboard} from "@/helpers/copy-to-clipboard.helpers.js"
import Copy from "@/src/icons/Copy"

type Props = {
    services: Array<Service>,
    onClose: () => void
}

function ShareDirectlyOptions({
    services,
    onClose,
}: Props) {
    const [nativeShareSupported, setNativeShareSupported] = useState(false)
    const [includeOtherDetails, setIncludeOtherDetails] = useState<boolean>(false)
    const {openToastMessage} = useToastMessage()

    const isPlural = services.length > 1

    const baseUrl = isMounted() ? location.origin : ""

    let textToShare: string
    if (includeOtherDetails) {
        textToShare = services.map(service => `
            ${service.name}
            Address: ${(service.location?.singleLineStreetAddress() ?? "")}
            ${service.location?.details ?? ""}
            More info: ${baseUrl}/service/${service.slug}
        `
            // $FlowIgnore flow is out of date and replaceAll exists
            .replace(/\n {12}/g, "\n").replace(/\n(?=\n)/g, "").trim()).join("\n\n")
    } else {
        textToShare = services.map(service => `${baseUrl}/service/${service.slug}`).join("\n\n")
    }

    const shareData: Record<string, unknown> = {}

    shareData.title = "List of Ask Izzy services"
    shareData.text = textToShare


    useEffect(() => {
        if (
            typeof navigator !== "undefined" &&
            (!navigator.canShare || navigator.canShare(shareData))
        ) {
            setNativeShareSupported(true)
        }
    }, [])

    function GAIndividualServices(event: string, eventLabel: string) {
        for (const service of services) {
            gtm.emit({
                event: event,
                eventCat: "Action triggered",
                eventAction: "Services shared (individual)",
                eventLabel: eventLabel,
                eventValue: service.id,
                sendDirectlyToGA: true,
            });
        }
    }

    return (
        <div className="ShareDirectlyOptions">
            <StandardButton
                onClick={async function() {
                    CopyToClipboard(textToShare)
                    GAIndividualServices(
                        "Action Triggered - Services Shared Via Clipboard (individual)",
                        "Clipboard",
                    )
                    onClose()
                    openToastMessage(`Link${isPlural ? "s" : ""} copied`)
                }}
                analyticsEvent={{
                    event: "Action Triggered - Services Shared Via Clipboard",
                    eventAction: "Services shared",
                    eventLabel: "Clipboard",
                    eventValue: services.length,
                }}
                aria-label={`Copy link${isPlural ? "s" : ""}`}
            >
                <Copy />
                Copy link{isPlural ? "s" : ""}
            </StandardButton>
            {nativeShareSupported && (
                <StandardButton
                    onClick={async() => {
                        GAIndividualServices(
                            "Action Triggered - Services Shared Via Web Share API (individual)",
                            "Web Share API",
                        )
                        try {
                            // $FlowIgnore Flow.js currently out-of-date and doesn't know about the share API
                            await navigator.share(shareData)
                        } catch (error) {
                            console.log(
                                `Native share was not able to share service${isPlural ? "s" : ""}. ` +
                                `Error message: ${error.message}`,
                            )
                        }

                    }}
                    analyticsEvent={{
                        event: "Action Triggered - Services Shared Via Web Share API",
                        eventAction: "Services shared",
                        eventLabel: "Web Share API",
                        eventValue: services.length,
                    }}
                >
                    More
                </StandardButton>
            )}
            <div className="includeOtherDetails">
                <input
                    type="checkbox"
                    id="includeOtherDetails"
                    value={includeOtherDetails as any}
                    onChange={({target}) => setIncludeOtherDetails(target.checked)}
                />
                <label htmlFor="includeOtherDetails">
                    Include service name and address
                </label>
            </div>
        </div>
    )
}

export default ShareDirectlyOptions
