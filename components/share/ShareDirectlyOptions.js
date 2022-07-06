/* @flow */

import * as React from "react";
import {useState, useEffect} from "react";

import isMounted from "@/hooks/useIsMounted"
import SendForm from "./SendForm"
import Dialog from "@/components/base/Dialog"
import StandardButton from "@/components/general/StandardButton"
import Input from "@/src/components/base/Input"
import EmailIcon from "@/src/icons/Email"
import PhoneIcon from "@/src/icons/Phone"


function ShareDirectlyOptions(): React.Node {
    const [nativeShareSupported, setNativeShareSupported] = useState(false)

    const shareData = {
        title: 'MDN',
        text: 'Learn web development on MDN!',
        url: 'https://developer.mozilla.org',
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
            <StandardButton onClick={() => setScreen("Via Ask Izzy")}>
                Copy link
            </StandardButton>
            {nativeShareSupported && <StandardButton onClick={() => navigator.share(shareData)}>
                More
            </StandardButton>}
            <div>
                <input
                    type="checkbox"
                    id="includeOtherDetails"
                />
                <label htmlFor="includeOtherDetails">
                    Include service name and address
                </label>
            </div>
        </div>
    )
}

export default ShareDirectlyOptions
