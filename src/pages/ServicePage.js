/* @flow */

import mui from "material-ui";
import React from 'react';
import ServicePane from "../components/ServicePane";

import iss from '../iss';

class CategoryPage extends React.Component {
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
        } else return (
            <div>
                <ServicePane service={object}/>
            </div>
        );
    }

}

export default CategoryPage;
