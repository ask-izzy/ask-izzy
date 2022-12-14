import React from "react";
import {useRouter} from "next/router"

import PhoneButton from "@/src/components/PhoneButton";
import StrapiMarkdown from "@/src/components/StrapiMarkdown";
import Link from "@/src/components/base/Link";
import * as gtm from "@/src/google-tag-manager";

export type CalloutType = {
    id: number,
    Key: string,
    Heading: string,
    ShowHeading: boolean,
    Body: string,
    Style: Record<string, any> | null,
    Phone: string,
    Link: string | null,
    className: number,
    created_at: string,
    updated_at: string,
}

export type CalloutBoxType = {
    id: number,
    callout: CalloutType,
    Top: boolean,
    Bottom: boolean,
    created_at: string,
    updated_at: string,
}

type Props = {
    calloutBoxes: Array<CalloutBoxType>,
    embedded: boolean,
    position?: string | null,
}

/**
 * The Callout Box component
 *
 * @param calloutBoxes - A list of Callout boxes from the CMS
 * @param position - the position where they appear
 * @param embedded - if the callout box is to be embedded in the page content
 * @returns {null|*} - returns the callout box or null
 * @constructor
 */
function CalloutBox({
    calloutBoxes,
    position = null,
    embedded = false,
}: Props) {

    const router = useRouter();

    function getAnalyticsEvent(callout: CalloutType) {
        return {
            event: `Link Followed - Callout`,
            eventCat: "Link followed",
            eventAction: "Callout",
            eventLabel: callout.Heading,
            sendDirectlyToGA: true,
        }
    }

    const onClickBox = (callout: CalloutType): void => {
        const {Link: path} = callout
        if (!path) {
            return;
        }

        gtm.emit(getAnalyticsEvent(callout))

        // if the path is local (as defined by prefixed slash)
        // go to the internal link, else open it externally
        if (path.charAt(0) === "/") {
            router.push(path);
        } else {
            (window as any).location = path;
        }

    }

    /**
     * The callout cox JSX
     *
     * @param callout - The callout details
     * @returns {JSX.Element} - The Component
     * @constructor
     */
    const Box = ({callout}: any) => (
        <div
            onClick={callout.Link ? () => onClickBox(callout) : undefined}
            style={callout.Style ? callout.Style : {}}
            className={"CalloutBox " + (callout.className?.className ?
                callout.className.className
                : "askIzzyInfoBox")}
        >
            {callout.ShowHeading && <h2>{callout.Heading}</h2>}
            <StrapiMarkdown
                renderers={{
                    // eslint-disable-next-line react/display-name
                    link: ({href, children}) =>
                        <Link
                            to={href}
                            analyticsEvent={getAnalyticsEvent(callout)}
                        >
                            {children}
                        </Link>,
                }}
            >
                {callout.Body}
            </StrapiMarkdown>
            {callout.Phone &&
                <PhoneButton
                    number={callout.Phone}
                    comment=""
                    kind=""
                    crisis={true}
                />}
        </div>
    )

    // Remove callout refs that refer to a callout not exist
    calloutBoxes = calloutBoxes.filter(({callout}) => callout)

    // Returns if there are no callout boxes
    if (!calloutBoxes && !(calloutBoxes as CalloutBoxType[]).length) {
        return <></>;
    }

    return (
        <>
            {calloutBoxes.map((callout: CalloutBoxType, index: number) => {
                const calloutObj = Object.assign({}, callout.callout);

                if (calloutObj.Link) {
                    // if there is a style extend the object with a cursor style
                    calloutObj.Style = calloutObj.Style ?
                        {...calloutObj.Style, cursor: "pointer"}
                        // if there is no style then set the cursor
                        : {cursor: "pointer"}
                }

                if (embedded) {
                    return (
                        <Box
                            callout={calloutObj}
                            key={`${callout.callout.id}_${index}`}
                        />
                    )
                } else if (position && position === "top" && callout.Top) {
                    return (
                        <Box
                            callout={calloutObj}
                            key={`${callout?.callout.id}_${index}`}
                        />
                    )
                } else if (position && position === "bottom" && callout.Bottom) {
                    return (
                        <Box
                            callout={calloutObj}
                            key={`${callout?.callout.id}_${index}`}
                        />
                    )
                }
                return null;
            })}
        </>
    )
}

CalloutBox.defaultProps = {
    embedded: false,
    Top: false,
    Bottom: false,
    position: null,
}

export default CalloutBox
