/* @flow */

import React from "react";
import Router from 'react-router';

export default class BasePage extends React.Component {

    render(): React.Element {
        return (
            <Router.RouteHandler />
        );
    }

}
