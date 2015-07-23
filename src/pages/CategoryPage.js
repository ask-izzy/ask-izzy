/* @flow */

import React from "react";
import Router from 'react-router';

class CategoryPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        this.setState({ categoryKey: this.props.params.categoryName });
    }

    componentWillReceiveProps(nextProps: Object): void {
        this.setState({ categoryKey: nextProps.params.categoryName });
    }

    render(): React.Element {
        return (
            <div>
                category page for {this.state.categoryKey}
                <Router.RouteHandler />
            </div>
        );
    }

}

export default CategoryPage;
