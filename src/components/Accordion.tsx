import React from "react";
import StrapiMarkdown from "@/src/components/StrapiMarkdown.js";
import AccordionItem from "@/src/components/AccordionItem.js";


type Props = {
    title: string,
    items: Array<Record<string, any>>,
}

const Accordion = ({
    title,
    items,
}: Props) => {

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
