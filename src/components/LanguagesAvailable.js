/* @flow */
import type {Node as ReactNode} from "React";
import React from "react";
import Collapser from "./general/Collapser";
import Spacer from "./Spacer";
import { shortenText } from "@/helpers/string.helpers";
import Service from "../iss/Service";
import Language from "@/src/icons/Language";

type Props = {
    service: Service,
    externalCollapsed?: boolean, // New prop for external control
    onToggle?: (isCollapsed: boolean) => void, // New prop for toggle handling
}

export default function LanguagesAvailable({ service, externalCollapsed, onToggle }: Props): ReactNode {
    const languagesSpoken = `Languages spoken at this service are English, ${service.languages.join(", ")}`;
    const maxCharLength = 60;

    return (
        <div className="LanguagesAvailable">
            <Spacer />
            <div className="languages-spoken-container">
                <Language />
                {
                    languagesSpoken.length < maxCharLength ?
                        <span className="languages-spoken">
                            {languagesSpoken}
                        </span>
                        : <>
                            <Collapser
                                contentPreview={shortenText(60, languagesSpoken)}
                                expandMessage="Show all languages"
                                collapseMessage="Hide all languages" // Add collapse message
                                analyticsEvent={{
                                    event: `Action Triggered - Languages Spoken`,
                                    eventAction: "Show full languages spoken",
                                    eventLabel: null,
                                }}
                                externalCollapsed={externalCollapsed} // Pass externalCollapsed prop
                                onToggle={onToggle} // Pass onToggle prop
                            >
                                {languagesSpoken}
                            </Collapser>
                        </>
                }
            </div>
        </div>
    );
}
