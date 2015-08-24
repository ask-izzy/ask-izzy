/* @flow */

import React, { PropTypes } from "react";
import Router from "react-router";
import colors from "../constants/theme";
import fixtures from "../../fixtures/services";
import mui from "material-ui";
import reactMixin from "react-mixin";

import icons from "../icons";
import OpeningTimes from "./OpeningTimes";

var palette = colors.getPalette();

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
class ResultTile extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        object: PropTypes.object.isRequired,
    };

    // flow:disable not supported yet
    static sampleProps = {object: fixtures.ixa};

    render(): React.Element {
        var {
            object,
        } = this.props;

        console.log(object);

        return (
            <mui.ListItem
                className="ResultTile"
                href={this.makeHref('service', {id: object.id})}
                onTouchTap={(event) => {
                    this.transitionTo('service', {id: object.id});
                }}

                rightIcon={
                    <icons.Chevron
                        className="ColoredIcon icon-fg-color"
                    />
                }
            >
                <div className="name">{object.name}</div>
                <div className="site_name">{object.site.name}</div>
                <OpeningTimes className="opening_hours" object={object} />
                <div>FIXME transport time</div>
                <div className="service_type">{object.service_types[0]}</div>
            </mui.ListItem>
        );
    }
}

export default ResultTile;
