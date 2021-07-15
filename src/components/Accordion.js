/* @flow */
import * as React from "react";
import StrapiMarkdown from "../components/StrapiMarkdown";
import AccordionItem from "./AccordionItem";

type Props = {
    title: string,
    items: Array<Object>,
}

const Accordion: React.StatelessFunctionalComponent<Props> = (
    {title, items}
): React.Node => {

    const renderItem = (item, index) => {
        return (
            <li key={item.id}>
                <AccordionItem
                    title={item.Title}
                    key={index}
                >
                    <StrapiMarkdown>
                        {item.Content}
                    </StrapiMarkdown>
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
