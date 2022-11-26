import React, {useState, useEffect} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";

import isMounted from "@/hooks/useIsMounted"
import StandardButton from "@/components/general/StandardButton"
import Service from "@/src/iss/Service"
import useToastMessage from "@/hooks/useToastMessage"
import * as gtm from "@/src/google-tag-manager";

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
            .replaceAll(/\n {12}/g, "\n").replaceAll(/\n(?=\n)/g, "").trim()).join("\n\n")
    } else {
        textToShare = services.map(service => `${baseUrl}/service/${service.slug}`).join("\n")
    }

    const shareData: Record<string, unknown> = {}

    shareData.title = "List of Ask Izzy services"

    if (isPlural) {
        shareData.text = textToShare
    } else {
        shareData.url = textToShare
    }

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
            <CopyToClipboard
                text={textToShare}
            >
                <StandardButton
                    onClick={() => {
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
                >
                    Copy link{isPlural ? "s" : ""}
                </StandardButton>
            </CopyToClipboard>
            {nativeShareSupported && (
                <StandardButton
                    onClick={() => {
                        GAIndividualServices(
                            "Action Triggered - Services Shared Via Web Share API (individual)",
                            "Web Share API",
                        )
                        // $FlowIgnore Flow.js currently out-of-date and doesn't know about the share API
                        navigator.share(shareData)
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
