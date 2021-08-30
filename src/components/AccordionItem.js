/* @flow */
import * as React from "react";

import icons from "../icons";
import Summary from "./base/Summary";

type Props = {
    title: string,
    children: React.Node,
}

const AccordionItem: React.StatelessFunctionalComponent<Props> = (
    {children, title}
) => {
    return (
        <details className="AccordionItem">
            <Summary
                analyticsEvent={{
                    event: `Action Triggered - Accordion`,
                    eventAction: "Show accordion body",
                    eventLabel: title,
                }}
            >
                <div> {/* wrapper needed for safari flex bug https://bugs.webkit.org/show_bug.cgi?id=190065 */}
                    <h3 className="title">{title}</h3><icons.Chevron />
                </div>
            </Summary>
            <div className="AccordionItemContent">
                {children}
            </div>
        </details>
    )
}
export default AccordionItem;
