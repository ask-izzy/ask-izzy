/* @flow */

import * as React from "react";
import {useState, useEffect} from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import isMounted from "@/hooks/useIsMounted"
import SendForm from "./SendForm"
import Dialog from "@/components/base/Dialog"
import StandardButton from "@/components/general/StandardButton"
import Input from "@/src/components/base/Input"
import EmailIcon from "@/src/icons/Email"
import PhoneIcon from "@/src/icons/Phone"
import Service from "@/src/iss/Service"

type Props = {
    services: Array<Service>
}

function ShareDirectlyOptions({
    services,
}: Props): React.Node {
    const [nativeShareSupported, setNativeShareSupported] = useState(false)
    const [includeOtherDetails, setIncludeOtherDetails] = useState<boolean>(false)

    const isPlural = services.length > 1

    const baseUrl = isMounted ? location.origin : ""

    let textToShare: string
    if (includeOtherDetails) {
        textToShare = services.map(service => `
            ${service.name}
            Address: ${(service.location?.singleLineStreetAddress() ?? "")}
            ${service.location?.details ?? ""}
            More info: ${baseUrl}/service/${service.slug}
        `.replaceAll(/\n {12}/g, "\n").replaceAll(/\n(?=\n)/g, "").trim()).join("\n\n")
    } else {
        textToShare = services.map(service => `${baseUrl}/service/${service.slug}`).join("\n")
    }

    const shareData = {
        title: 'List of Ask Izzy services',
    }

    if (isPlural) {
        shareData.text = textToShare
    } else {
        shareData.url = textToShare
    }

    useEffect(() => {
        if (
            typeof navigator !== "undefined" &&
            navigator.share &&
            (!navigator.canShare || navigator.canShare(shareData))
        ) {
            console.log('navigator.canShare?.(shareData)', navigator.canShare?.(shareData))
            setNativeShareSupported(true)
        }
    }, [])



    return (
        <div className="ShareDirectlyOptions">
            <CopyToClipboard
                text={textToShare}
            >
                <StandardButton onClick={() => {}}>
                    Copy link{isPlural ? "s" : ""}
                </StandardButton>
            </CopyToClipboard>
            {nativeShareSupported && <StandardButton onClick={() => navigator.share(shareData)}>
                More
            </StandardButton>}
            <div className="includeOtherDetails">
                <input
                    type="checkbox"
                    id="includeOtherDetails"
                    value={includeOtherDetails}
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
