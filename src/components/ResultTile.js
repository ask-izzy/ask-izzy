/* @flow */

import React, { PropTypes } from "react";
import Router, { Link } from "react-router";
import mui from "material-ui";

import colors from "../constants/theme";
var palette = colors.getPalette();

import icons from "../icons";
import OpeningTimes from "./OpeningTimes";

class ResultTile extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        object: PropTypes.object.isRequired,
    };

    // flow:disable not supported yet
    static contextTypes = Link.contextTypes;

    href(): string {
        var {
            object,
        } = this.props;

        return this.context.router.makeHref(
            "service",
            {id: object.id},
            {}
        );
    }

    render(): React.Element {
        var {
            object,
        } = this.props;

        console.log(object);

        return (
            <mui.ListItem
                className="ResultTile"
                href={this.href()}
                rightAvatar={
                    <mui.Avatar
                        className="colored-icon"
                        backgroundColor={mui.Styles.Colors.transparent}
                        icon={
                            <icons.Chevron />
                        }
                        style={{borderRadius: 0}}
                    />
                }
            >
                <div>{object.name}</div>
                <div>{object.site.name}</div>
                <OpeningTimes object={object} />
                <div>FIXME transport time</div>
                <div>{object.service_types[0] /* jscs:disable */}</div>
            </mui.ListItem>
        );
    }
}

export default ResultTile;
