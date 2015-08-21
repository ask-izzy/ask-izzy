/* @flow */

"use strict";

import mui from "material-ui";
import NavigationArrowBack from
    "material-ui/lib/svg-icons/navigation/arrow-back";
import React from 'react';
import Router from "react-router";
import ServicePane from "../components/ServicePane";
import reactMixin from "react-mixin";

import iss from '../iss';

@reactMixin.decorate(Router.Navigation)
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
        iss(`service/${this.props.params.id}/`)
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
                    <mui.AppBar
                        title={object.site.name}
                        iconElementLeft={
                            <mui.IconButton
                                onTouchTap={this.goBack.bind(this)}
                            >
                                <NavigationArrowBack />
                            </mui.IconButton>
                        }
                    />
                    <ServicePane service={object}/>
                </div>
            );
        }
    }

}

export default ServicePage;
