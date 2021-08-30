/* @flow */

import type {Node as ReactNode} from "React";
import React from "react";
import icons from "../icons";
import LinkListItem from "./LinkListItem";
import maps, {MapsApi} from "../maps";

type State = {
    maps: ?MapsApi
}

type Props = {
    to: string
}

export default class ViewOnMapButton extends React.Component<Props, State> {
    constructor() {
        super();
        this.state = {maps: null};
    }

    componentDidMount(): void {
        maps().then(maps => this.setState({maps}));
    }

    render(): null | ReactNode {
        if (!this.state.maps) {
            return null;
        }

        return (
            <LinkListItem
                className="ViewOnMapButton"
                primaryText="View on a map"
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


