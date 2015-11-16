/* @flow */

import React from "react";
import icons from "../icons";
import LinkListItem from "./LinkListItem";

export default (props: Object): ReactElement =>
    <LinkListItem
        className="ViewOnMapButton"
        primaryText="View on a map"
        leftIcon={
            <icons.Map />
        }
        rightIcon={
            <icons.Chevron />
        }
        {...props}
    />;
