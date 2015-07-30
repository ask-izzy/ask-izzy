/* @flow */

import React from "react";
import Router from 'react-router';
import iss from '../services/iss';

class CategoryPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            loaded: "Loading...",
        };
    }

    componentDidMount(): void {
        var foo = iss('housing');
        foo.then(
                (data) => {
                    this.setState({
                        data: data,
                        loaded: "Complete",
                    });
                }

            );
        foo.catch(
            (error) => {
                this.setState({
                    error: error,
                    loaded: "Failed",
                });
            }

        );
    }

    componentWillReceiveProps(nextProps: Object): void {
        this.setState({ categoryKey: nextProps.params.categoryName });
    }

    render(): React.Element {
        return (
            <div>
                category page for {this.state.categoryKey}
                <Router.RouteHandler />
                <p>
                    { this.state.error }
                </p>
                <p>
                    { JSON.stringify(this.state.data) }
                </p>
                <p>
                    { this.state.loaded }
                </p>
            </div>
        );
    }

}

export default CategoryPage;
