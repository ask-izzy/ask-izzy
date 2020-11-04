/* @flow */

import React from "react";

import ContentItem from "./ContentItem";

type DefaultProps = {|
    className: string,
|}

type Content = {
    Title: string,
    id: string,
    Body?: string,
    Link?: string,
    Author?: string,
}

type Props = {
    ...DefaultProps,
    items? : Array<Content>,
    category?: boolean,
};

class ContentList extends React.Component<Props> {

    static defaultProps = {
        className: "",
    }

    render() {
        return (
            this.props.items !== undefined ? (
                <ul className={"ContentList " + this.props.className}>
                    {(this.props.items).map(item =>
                        <ContentItem
                            title={item.Title}
                            id={item.id}
                            body={item.Body}
                            subtitle={item.Author}
                            link={item.Link}
                            key={item.id}
                        />
                    )}
                </ul>
            ) : ""
        );
    }

}

export default ContentList;