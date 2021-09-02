/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";

import icons from "../icons";
import LinkListItem from "./LinkListItem";

type Props = {
    to: string
}
export default class ViewOnMapButton extends React.Component<Props> {
    render(): null | ReactNode {
        return (
            <LinkListItem
                className="ViewOnMapButton"
                primaryText="View results on map"
                leftIcon={
                    <icons.Map className="big" />
                }
                rightIcon={
                    <icons.Chevron />
                }
                to={this.props.to}
                analyticsEvent={{
                    event: "Link Followed - Results Map",
                    eventAction: "View results map",
                    eventLabel: null,
                }}
            />
        );
    }
}


