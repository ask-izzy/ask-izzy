/* @flow */

// Approach: Preload the data on the server (in componentWillMount),
// then update content on the client (also in componentWillMount, but now via XHR)
// then in componentwillreceiveprops update it again if there's a new state.

// prioritize design high - things need to work with isaac this week / look right for CHP conf

// window.fetch does not CORS nicely. Use a proxy.

import React from "react";
import Router from 'react-router';
import Loading from "../components/Loading"
import iss from '../services/iss';

class CategoryPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            loading: "",
            data: undefined,
            error: undefined,
        }
    }

    componentWillMount(): void {
        this.startQuery();
    }
    startQuery(): void {
        var foo = iss('housing');

        this.setState({
            loading: "loading",
            data: undefined,
            error: undefined,
            request: foo,
        });

        foo.then(
            (data) => {
                this.setState({
                    data: data,
                    loading: "complete",
                });
            }

        );
        foo.catch(
            (error) => {
                this.setState({
                    error: error,
                    loading: "failed",
                });
            }
        );
    }

    componentWillReceiveProps(nextProps: Object): void {

    }

    render(): React.Element {
        return (
            <div>
                category page for {this.props.params.categoryName}
                <Router.RouteHandler />
                <p>
                    { this.state.error }
                </p>
                <p>
                    { JSON.stringify(this.state.data) }
                </p>
                <p>
                    <Loading state={this.state.loading} />
                </p>
            </div>
        );
    }

}

export default CategoryPage;
