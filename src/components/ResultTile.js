/* @flow */

import React from "react";
import Router from "react-router";
import colors from "../constants/theme";
import fixtures from "../../fixtures/services";
import mui from "material-ui";
import reactMixin from "react-mixin";

import icons from "../icons";
import OpeningTimes from "./OpeningTimes";
import TransportTime from "./TransportTime";

var palette = colors.getPalette();

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
class ResultTile extends React.Component {
    // flow:disable not supported yet
    static propTypes = {
        object: React.PropTypes.object.isRequired,
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
