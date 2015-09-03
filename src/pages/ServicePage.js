/* @flow */

"use strict";

import mui from "material-ui";
import React from 'react';
import Router from "react-router";
import ServicePane from "../components/ServicePane";
import reactMixin from "react-mixin";

import * as iss from '../iss';
import components from '../components';
import icons from "../icons";

/*::`*/@reactMixin.decorate(Router.Navigation)/*::`;*/
class ServicePage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    /**
     * search:
     * Do a search in ISS
     *
     * Returns: a promise to an object of data from ISS.
     */

    componentDidMount(): void {
        iss.getService(this.props.params.id)
            .then(data => {
                this.setState({
                    object: data,
                });
            });

        // FIXME: display error on failure to connect
    }

    render(): React.Element {
        var {
            object,
        } = this.state;
        if (!object) {
            return <div/>;
        } else {
            return (
                <div>
                    <components.AppBar
                        title={object.site.name}
                        onBackTouchTap={this.goBack.bind(this)}
                    />
                    <ServicePane service={object}/>
                </div>
            );
        }
    }

}

export default ServicePage;
