/* @flow */

import React from "react";
import type {Node as ReactNode} from "react";
import Link from "../base/Link";

type Props = {
    id: number,
    title : string,
    subtitle?: string,
    link: string,
    body: ReactNode,
};

class ContentItem extends React.Component<Props> {

    render(): ReactNode {
        return (
            <li className="ContentItem">
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
