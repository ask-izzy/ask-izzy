/* @flow */

import React from "react";
import { Link } from "react-router";

class Infobox extends React.Component {
    props: Object;
    state: Object;
    static propTypes = {
        href: React.PropTypes.string,
        to: React.PropTypes.string,
        linkText: React.PropTypes.string,
    };

    static defaultProps = {
        linkText: "More information",
    };

    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    static sampleProps = {default: {
        linkText: "Housing information",
        href: "#",
        children: "It's important to act early on housing.",
    }};

    render() {
        let {
            linkText,
            ...other,
        } = this.props;

        return (
            <div className="Infobox">
                <div>
                    {this.props.children}
                </div>
                {
                    this.props.href || this.props.to ?
                        <div>
                            <div className="secondary">
                                Find out more
                            </div>
                            {this.props.href ?
                                    <a
                                        className="Link"
                                        {...other}
                                    >
                                        {linkText}
                                    </a>
                                : <Link
                                    className="Link"
                                    {...other}
                                  >
                                    {linkText}
                                </Link>
                            }
                        </div>
                    : ""
                }
            </div>
        );
    }
}

export default Infobox;
