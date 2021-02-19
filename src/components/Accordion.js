/* @flow */
import * as React from "react";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

import AccordionItem from "./AccordionItem";

type Props = {
    title: string,
    items: Array<Object>,
}

const absoluteImageUrl = (uri: string): string => {
    // Strapi returns a relative image url, we need to change
    // it to point to our content server.
    return window.STRAPI_URL + uri;
}

const Accordion: React.StatelessFunctionalComponent<Props> = (
    {title, items}
): React.Node => {

    const renderItem = (item, index) => {
        return (
            <li>
                <AccordionItem
                    title={item.Title}
                    key={index}
                >
                    <ReactMarkdown
                        plugins={[gfm]}
                        source={item.Content}
                        transformImageUri={
                            absoluteImageUrl
                        }
                    />
                </AccordionItem>
            </li>
        )
    }

    const accordionList = items.map(renderItem)

    return (
        <div className="Accordion">
            {title ? (<h2>{title}</h2>) : ""}
            <ul className="AccordionList">
                {accordionList}
            </ul>
        </div>
    )
}
export default Accordion;