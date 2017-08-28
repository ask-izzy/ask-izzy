/* @flow */
/* Generated by ./script/iconify */
/* eslint-disable max-len */

import React from "react";
import classnames from "classnames";

export default class SvgIconBlank extends React.Component {
    props: {
        className?: string,
    };
    state: void;

    render() {
        const {className, ...rest} = this.props;
        const classes = classnames(
            "BlankIcon",
            "disallow-override-color",
            "Icon",
            "SvgIcon",
            className
        );

        return (
            <span
                {...rest}
                dangerouslySetInnerHTML={{__html: `
                    <svg class='${classes}' xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" version="1.1" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"  xml:space="preserve" id="svg4450" sodipodi:docname="askizzy-icon-blank.svg" inkscape:version="0.92.1 r15371"><g></g></svg>
                `}}
            />
        );
    }
}
