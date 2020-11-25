/* @flow */

import React from "react";
import icons from "../icons";
import LinkListItem from "./LinkListItem";

export default class ViewOnMapButton<props> extends React.Component<props> {
    render() {
        return (
            <LinkListItem
                className="ViewOnMapButton"
                primaryText="View results on map"
                leftIcon={
                    <icons.Map />
                }
                rightIcon={
                    <icons.Chevron />
                }
                {...this.props}
            />
        );
    }
}


