/* @flow */

import React from "react";
import { Link } from "react-router-dom";

type Props = {
    id: Number,
    title : String,
    subtitle?: String,
    link?: String,
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
                        className="learnMore"
                        to={this.props.link}
                        rel="noopener noreferer"
                    >
                        {this.props.title}
                    </Link>
                </h3>
                {this.props.subtitle ? (<h4>{this.props.subtitle}</h4>) : null}
                <div className="body">{this.props.body}</div>
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