/* @flow */

import React from "react";

import ContentItem from "./ContentItem";

type Props = {
    items? : Array,
    category?: boolean,
};

class ContentList extends React.Component<Props> {

    render() {
        return (
            this.props.items !== undefined ? (
                <ul className="ContentList">
                    {(this.props.items).map(item =>
                        <ContentItem
                            title={item.Title}
                            id={item.id}
                            body={item.Body}
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