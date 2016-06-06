/* @flow */
/* Generated by ./script/iconify */
/* eslint-disable max-len */

import React from "react";
import classnames from "classnames";

export default class SvgIconTram extends React.Component {
    props: {
        className?: string,
    };
    state: void;

    render() {
        const {className, ...rest} = this.props;
        const classes = classnames(
            "TramIcon",
            "allow-override-color",
            "Icon",
            "SvgIcon",
            className
        );

        return (
            <span
                {...rest}
                dangerouslySetInnerHTML={{__html: `
                    <svg class='${classes}' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"  xml:space="preserve"><g id="tram"><g><path id="XMLID_664_" fill="#231F20"  d="M41.326,24.312c0-1.568-1.182-2.842-2.634-2.842H27.435 c-1.452,0-2.633,1.275-2.631,2.776l-0.743,11.448c-0.051,0.781,0.227,1.557,0.762,2.128c0.535,0.571,1.291,0.899,2.073,0.899 h0.062l-0.782,1.173c-0.314,0.47-0.187,1.106,0.284,1.42c0.174,0.116,0.372,0.172,0.566,0.172c0.331,0,0.656-0.16,0.852-0.456 l1.539-2.309h7.292l1.538,2.309c0.197,0.296,0.522,0.456,0.852,0.456c0.195,0,0.392-0.056,0.566-0.172 c0.471-0.314,0.597-0.95,0.284-1.42l-0.782-1.173h0.062c0.782,0,1.539-0.328,2.073-0.899c0.535-0.57,0.812-1.345,0.762-2.127 v-0.001L41.326,24.312z M27.435,23.517h11.257c0.319,0,0.587,0.364,0.589,0.861l0.386,5.941H26.459l0.389-6.007 C26.848,23.881,27.117,23.517,27.435,23.517z M39.812,36.423c-0.15,0.159-0.362,0.251-0.581,0.251H26.896 c-0.219,0-0.431-0.092-0.58-0.251c-0.15-0.16-0.228-0.377-0.213-0.596l0.224-3.46H39.8l0.225,3.46 C40.039,36.047,39.961,36.264,39.812,36.423z"></path><path id="XMLID_662_" fill="#231F20"  d="M28.365,33.543c-0.499,0-0.903,0.404-0.903,0.904c0,0.499,0.404,0.903,0.903,0.903 s0.903-0.404,0.903-0.903C29.268,33.947,28.864,33.543,28.365,33.543z"></path><path id="XMLID_660_" fill="#231F20"  d="M37.763,33.543c-0.499,0-0.903,0.404-0.903,0.904c0,0.499,0.404,0.903,0.903,0.903 c0.499,0,0.903-0.404,0.903-0.903C38.665,33.947,38.261,33.543,37.763,33.543z"></path></g></g><g id="Layer_1"></g></svg>
                `}}
            />
        );
    }
}
