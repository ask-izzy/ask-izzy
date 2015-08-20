/* @flow */

"use strict";

import mui from "material-ui";
import React from 'react';

import HeaderBar from '../components/HeaderBar';

class LocationPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    render(): React.Element {
        return (
            <div>
                <mui.AppBar title="Personalise" />
                <HeaderBar
                    primaryText="Where are you?"
                    secondaryText={
                        "This will let me find the services closest to you"
                    }
                />
            </div>
        );
    }

}

export default LocationPage;
