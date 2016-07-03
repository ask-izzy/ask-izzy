/* @flow */

import React from "react";
import icons from "../icons";
import LinkListItem from "./LinkListItem";
import maps from "../maps";
import type MapsApi from "../maps";

export default class ViewOnMapButton extends React.Component {
    props: any;
    state: {maps: ?MapsApi};

    constructor() {
        super();
        this.state = {maps: null};
    }

    componentWillMount(): void {
        maps().then((maps) => this.setState({maps}));
    }

    render() {
        if (!this.state.maps) {
            return null;
        }

        return (
            <LinkListItem
                className="ViewOnMapButton"
                primaryText="View on a map"
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


