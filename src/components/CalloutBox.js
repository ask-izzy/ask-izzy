/* @flow */
import * as React from "react";

import Phone from "./Phone";
import StrapiMarkdown from "./StrapiMarkdown";
import Link from "./base/Link";
import * as gtm from "../google-tag-manager";
import { useRouterContext } from "../contexts/router-context";

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
    {calloutBoxes, position, embedded}: Props): React.Node | null {

    const {navigate} = useRouterContext();

    function getAnalyticsEvent(callout: Callout) {
        return {
            event: `Link Followed - Callout`,
            eventCat: "Link followed",
            eventAction: "Callout",
            eventLabel: callout.Heading,
            sendDirectlyToGA: true,
        }
    }

    const onClickBox = (callout: Callout): void => {
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
            navigate(path);
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
                <Phone
                    number={`Call ${callout.Phone}`}
                    comment=""
                    kind=""
                    crisis={true}
                />}
        </div>
    )

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
