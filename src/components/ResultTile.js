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

        return (
            <mui.ListItem
                secondaryText={
                    <div>
                        <span>{object.site.name}</span><br />
                        <OpeningTimes object={object} />
                    </div>
                }
                secondaryTextLines={2}
            >
                {object.name}
            </mui.ListItem>
        );
    }

}
