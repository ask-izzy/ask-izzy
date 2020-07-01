/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";

import ContentItem from "./ContentItem";

type Props = {
    items? : Array<Object>,
    category?: boolean,
};

class ContentList extends React.Component<Props> {

    render(): ReactNode {
        return (
            this.props.items !== undefined ? (
                <ul className="ContentList">
                    {(this.props.items).map(item =>
                        <ContentItem
                            key={item.id}
                            title={item.Title}
                            id={item.id}
                            body={item.Body || ""}
                            subtitle={item.Author}
                            link={item.Link}
                        />
                    )}
                </ul>
            ) : ""
        );
    }

}

export default ContentList;
