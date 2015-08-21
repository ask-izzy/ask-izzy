/* @flow */

import React, { PropTypes } from "react";
import Router, { Link } from "react-router";
import mui from "material-ui";
import fixtures from "../../fixtures/services";
import colors from "../constants/theme";
var palette = colors.getPalette();

import icons from "../icons";
import OpeningTimes from "./OpeningTimes";
import TransportTime from "./TransportTime";

class ResultTile extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        object: PropTypes.object.isRequired,
    };

    // flow:disable not supported yet
    static sampleProps = {object: fixtures.ixa};

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
                <h2 className="name">{object.name}</h2>
                <div className="site_name">{object.site.name}</div>
                <OpeningTimes className="opening_hours" object={object} />
                <TransportTime object={object} />
                <ul className="service_type">{
                    (object.service_types || []).map(
                        service => <li>{service}</li>
                    )
                }</ul>
            </mui.ListItem>
        );
    }
}

export default ResultTile;
