/* @flow */

import React from 'react';
import Router from 'react-router';
import components from '../components';

var componentProps = (props) => props.params.componentName;
export default class StyleGuidePage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    setComponent(name: string) {
        this.setState({
            component: components[name],
            componentName: name,
        });
    }

    componentDidMount(): void {
        this.setComponent(componentProps(this.props));
    }

    componentWillReceiveProps(nextProps: Object): void {
        this.setComponent(componentProps(nextProps));
    }

    render(): React.Element {
        var Component = this.state.component;
        if (!this.state.componentName) {
            function li(componentName) {
                return (
                    <Router.Link
                        to="styleguideItem"
                        key={componentName}
                        params={{componentName: componentName}}
                        style={{clear: "both", float: "left"}}
                    >{componentName}</Router.Link>
                );
            }

            return (
                <ul>
                    { Object.keys(components).sort().map(li) }
                </ul>
            );
        }

        if (!Component) {
            return (
                <div>No such component {this.state.componentName}</div>
            );
        }

        return (
            <Component />
        );
    }

}
