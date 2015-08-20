/* @flow */

import mui from "material-ui";
import React from 'react';

import iss from '../iss';

class CategoryPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            object: {
                site: {},
            },
        };
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

        // FIXME: display error
    }

    render(): React.Element {
        var {
            object,
        } = this.state;

        return (
            <div>
                <mui.AppBar title={object.name} />
                <mui.Paper>
                    <p>
                        {object.site.name}
                    </p>
                </mui.Paper>
            </div>
        );
    }

}

export default CategoryPage;
