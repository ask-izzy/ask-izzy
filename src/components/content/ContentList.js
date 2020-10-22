/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";

import ContentItem from "./ContentItem";

type DefaultProps = {|
    className: string,
|}

type Content = {
    Title: string,
    id: string,
    Body?: string,
    Link: string,
    Author?: string,
}

type Props = {
    ...DefaultProps,
    items? : Array<Content>,
    category?: boolean,
};

class ContentList extends React.Component<Props> {
    static defaultProps: DefaultProps = {
        className: "",
    }

    render(): ReactNode {
        return (
            this.props.items !== undefined ? (
                <ul className={"ContentList " + this.props.className}>
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
