import React, { PropTypes } from "react";
import mui from "material-ui";

import colors from "../constants/theme";
var palette = colors.getPalette();

export default class OpeningTimes extends React.Component {
    static propTypes: {
        object: PropTypes.object.isRequired,
    }

    render(): React.Element {
        const {
            object,
        } = this.props;

        if (object.now_open.now_open) {  // jscs:disable
            return (
                <span>Now open</span>
            );
        } else {
            return (
                <span>Currently closed</span>
            );
        }

    }

}
