import React, {ReactNode} from "react";

import Chevron from "@/src/icons/Chevron.js";
import Summary from "@/src/components/base/Summary.js";

type Props = {
    title: string,
    children: ReactNode,
}

const AccordionItem = ({
    children,
    title,
}: Props) => {
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
                    <h3 className="title">{title}</h3><Chevron />
                </div>
            </Summary>
            <div className="AccordionItemContent">
                {children}
            </div>
        </details>
    )
}
export default AccordionItem;
