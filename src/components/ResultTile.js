import React, { PropTypes } from "react";
import mui from "material-ui";

import colors from "../constants/theme";
var palette = colors.getPalette();

export default class ServicePane extends React.Component {
    static propTypes = {
        object: PropTypes.object.isRequired,
    }

    render(): React.Element {
        const {
            object,
        } = this.props;

        return (
            <mui.ListItem>
                {object.name}
            </mui.ListItem>
        );
    }

}
