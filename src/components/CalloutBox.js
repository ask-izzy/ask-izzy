/* @flow */
import * as React from "react";
import {useRouter} from "next/router"

import PhoneButton from "./PhoneButton";
import StrapiMarkdown from "./StrapiMarkdown";
import Link from "./base/Link";
import * as gtm from "../google-tag-manager";

export type CalloutType = {
    id: number,
    Key: string,
    Heading: string,
    ShowHeading: boolean,
    Body: string,
    Style: Object | null,
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
    position?: ?string,
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
function CalloutBox(
    {calloutBoxes, position, embedded}: Props
): React.Node | null {

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
        const {Link: path, Heading} = callout
        if (!path) {
            return;
        }

        gtm.emit({
            event: "Callout Clicked",
            eventCat: "Callout Clicked",
            eventAction: null,
            eventLabel: Heading,
            sendDirectlyToGA: true,
        });

        gtm.emit(getAnalyticsEvent(callout))

        // if the path is local (as defined by prefixed slash)
        // go to the internal link, else open it externally
        if (path.charAt(0) === "/") {
            router.push(path);
        } else {
            window.location = path;
        }

    }

    /**
     * The callout cox JSX
     *
     * @param callout - The callout details
     * @returns {JSX.Element} - The Component
     * @constructor
     */
    const Box = ({callout}: any): React.Node => (
        <div
            onClick={callout.Link ? () => onClickBox(callout) : null}
            style={callout.Style ? callout.Style : {}}
            className={"CalloutBox " + (callout.className?.className ?
                callout.className.className
                : "askIzzyInfoBox")}
        >
            {callout.ShowHeading && <h2>{callout.Heading}</h2>}
            <StrapiMarkdown
                renderers={{
                    link: ({href, children}) =>
                        <Link
                            to={href}
                            children={children}
                            analyticsEvent={getAnalyticsEvent(callout)}
                        />,
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

    // Returns Null if there are no callout boxes
    if (!calloutBoxes && !calloutBoxes.length) {
        return null;
    }

    return calloutBoxes.map((callout: CalloutBoxType, index: number) => {
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
    })
}

CalloutBox.defaultProps = {
    embedded: false,
    Top: false,
    Bottom: false,
    position: null,
}

export default CalloutBox
