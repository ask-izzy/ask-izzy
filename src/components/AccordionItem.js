/* @flow */
import * as React from "react";
import icons from "../icons";

type Props = {
    title: string,
    children: React.Node,
}

const AccordionItem: React.StatelessFunctionalComponent<Props> = (
    {children, title}
) => {
    return (
        <details className="AccordionItem">
            <summary>
                <div role="text"> {/* wrapper needed for safari flex bug https://bugs.webkit.org/show_bug.cgi?id=190065 */}
                    <h3 className="title">{title}</h3><icons.Chevron />
                </div>
            </summary>
            <div className="AccordionItemContent">
                {children}
            </div>
        </details>
    )
}
export default AccordionItem;
