/* @flow */

import React from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

type Props = {
    id: string,
    title : string,
    subtitle?: string,
    link?: string,
    body?: string,
};

class ContentItem extends React.Component<Props> {

    render() {
        return (
            <li
                key={this.props.id}
                className="ContentItem"
            >
                <h3>
                    <Link
                        className="title"
                        to={this.props.link}
                        rel="noopener noreferer"
                    >
                        {this.props.title}
                    </Link>
                </h3>
                {this.props.subtitle ? (<h4>{this.props.subtitle}</h4>) : null}
                <div className="body">
                    <ReactMarkdown source={this.props.body} />
                </div>
                <Link
                    className="learnMore"
                    to={this.props.link}
                    rel="noopener noreferer"
                >
                    Learn More
                </Link>
            </li>
        );
    }

}

export default ContentItem;