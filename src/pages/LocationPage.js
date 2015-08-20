/* @flow */

"use strict";

import mui from "material-ui";
import React from 'react';

import Maps from '../maps';
import HeaderBar from '../components/HeaderBar';

async function locateMe(): Promise {
    var maps = await Maps();

    console.log("example", await maps.geocode({
        address: '33 Elizabeth St Richmond',
    }));
}

class LocationPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        locateMe()
            .then(() => {
            });
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
