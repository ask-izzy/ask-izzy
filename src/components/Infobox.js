/* @flow */
"use strict";

import React from "react";
import Router from "react-router";
import mui from "material-ui";
import reactMixin from "react-mixin";

import icons from "../icons";

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
class Infobox extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    // flow:disable not supported yet
    static propTypes = {
        href: React.PropTypes.string,
        to: React.PropTypes.string,
        linkText: React.PropTypes.string,
    };

    // flow:disable not supported yet
    static sampleProps = {default: {
        linkText: "Housing information",
        href: "#",
        children: "It's important to act early on housing.",
    },};

    // flow:disable
    static defaultProps = {
        linkText: "More information",
    };

    render(): React.Element {
        var {
            linkText,
            ...other
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
                            <mui.FlatButton
                                label={linkText}
                                containerElement={
                                    this.props.href ?
                                        <a className="Link" {...other} />
                                    :
                                        <Router.Link
                                            className="Link"
                                            {...other}
                                        />
                                }
                            >
                            </mui.FlatButton>
                        </div>
                    :
                        ''
                }
            </div>
        );
    }
}

export default Infobox;
