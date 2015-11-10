/* @flow */
/* Generated by ./script/iconify */
/* eslint-disable max-len */


import React from "react";

export default class SvgIconRadioUnselected extends React.Component {
    render(): ReactElement {
        const {className, ...rest} = this.props;
        const classes = `RadioUnselectedIcon Icon SvgIcon ${className || ""}`;

        return (
            <span
                {...rest}
                dangerouslySetInnerHTML={{__html: `
                    <svg class='${classes}' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"  xml:space="preserve"><g id="radio-unselected"><g><path fill="#231F20"  d="M32,47.476c-8.533,0-15.476-6.942-15.476-15.476S23.467,16.524,32,16.524S47.476,23.467,47.476,32 S40.533,47.476,32,47.476z M32,18.724c-7.32,0-13.276,5.956-13.276,13.276S24.68,45.276,32,45.276S45.276,39.32,45.276,32 S39.32,18.724,32,18.724z"></path></g></g><g id="Layer_1"></g></svg>
                `}}
            />
        );
    }
}
