import React, { PropTypes } from "react";
import mui from "material-ui";

import colors from "../constants/theme";
var palette = colors.getPalette();

import OpeningTimes from "./OpeningTimes";

export default class ResultTile extends React.Component {
    static propTypes: {
        object: PropTypes.object.isRequired,
    }

    render(): React.Element {
        const {
            object,
        } = this.props;

        console.log(object);

        return (
            <mui.ListItem>
                <div>{object.name}</div>
                <div>{object.site.name}</div>
                <OpeningTimes object={object} />
                <div>FIXME transport time</div>
                <div>{object.service_types[0] /* jscs:disable */}</div>
            </mui.ListItem>
        );
    }

}
