/* @flow */
/* jscs: disable */
import React from "react";
import mui from "material-ui";

export default class SvgIconTick extends React.Component {

    render(): React.Component {
        return (
            <mui.SvgIcon
                {...this.props}
                viewBox="0 0 64 64"
            >
            <path d='M25.481,39.924c-0.281,0-0.563-0.107-0.777-0.322l-7.308-7.308c-0.43-0.429-0.43-1.126,0-1.555    c0.428-0.43,1.127-0.43,1.555,0l6.53,6.529L42.64,20.11c0.428-0.43,1.127-0.43,1.555,0c0.43,0.429,0.43,1.126,0,1.555    L26.259,39.601C26.045,39.816,25.762,39.924,25.481,39.924z' />
            </mui.SvgIcon>
        );
    }

}
