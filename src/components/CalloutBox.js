/* @flow */

import * as React from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import Phone from "./Phone";
import {absoluteImageUrl, renderLink} from "../pages/DynamicPage.service";
import {useHistory} from "react-router-dom";
import sendEvent from "../google-tag-manager";

type Callout = {
    id: string,
    ShowHeading: boolean,
    Link?: ?string,
    className?: ?{className: string},
    Heading: string,
    Body?: ?string,
    Style?: ?Object,
    Phone?: ?string
}

type CalloutBoxType = {
    Top: boolean,
    Bottom: boolean,
    callout: Callout
}

type Props = {
    calloutBoxes: Array<CalloutBoxType>,
    position: string,
}

/**
 * The Callout Box component
 *
 * @param calloutBoxes - A list of Callout boxes from the CMS
 * @param position - the position where they appear
 * @returns {null|*} - returns the callout box or null
 * @constructor
 */
function CalloutBox({calloutBoxes, position}: Props): React.Node | null {

    const history = useHistory();

    const onClickBox = (path: string): void => {

        sendEvent({
            event: "clickedInformationBanner",
            banner: "Online safety - are you safe?",
        });

        // if the path is local (as defined by prefixed slash)
        // go to the internal link, else open it externally
        if (path.charAt(0) === "/") {
            history.push(
                path,
            );
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
            onClick={callout.Link ? () => onClickBox(callout.Link) : null}
            style={callout.Style ? callout.Style : {}}
            className={callout.className?.className ?
                callout.className.className
                : "askIzzyInfoBox"}
        >
            {callout.ShowHeading && <h2>{callout.Heading}</h2>}
            <ReactMarkdown
                plugins={[gfm]}
                source={callout.Body}
                transformImageUri={absoluteImageUrl}
                renderers={{"link": renderLink}}
            />
            {callout.Phone &&
                <Phone
                    number={callout.Phone}
                    comment=""
                    kind=""
                />}
        </div>
    )

    // Returns Null if there are no callout boxes
    if (!calloutBoxes && !calloutBoxes.length) {
        return null;
    }

    return calloutBoxes.map((callout, index) => {
        const calloutObj = callout.callout;

        if (calloutObj.Link) {
            // if there is a style extend the object with a cursor style
            calloutObj.Style = calloutObj.Style ?
                {...calloutObj.Style, cursor: "pointer"}
                // if there is no style then set the cursor
                : {cursor: "pointer"}
        }
        if (position === "top" && callout.Top) {
            return (
                <Box
                    callout={calloutObj}
                    key={`${callout.callout.id}_${index}`}
                />
            )
        } else if (position === "bottom" && callout.Bottom) {
            return (
                <Box
                    callout={callout.callout}
                    key={`${callout.callout.id}_${index}`}
                />
            )
        }
        return null;
    })
}

export default CalloutBox
