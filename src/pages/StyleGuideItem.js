/* @flow */

import React from 'react';
import Router from 'react-router';
import components from '../components';

export default class StyleGuideItem extends React.Component {
    constructor(props: Object) {
        super(props);
    }

    getComponentName(): string {
        return this.props.params.componentName;
    }

    getComponent(): React.Component {
        return components[this.getComponentName()];
    }

    render(): React.Element {
        var Component = this.getComponent();
        if (!Component) {
            return (
                <div>No such component {this.getComponentName()}</div>
            );
        }

        return (
            <Component {...Component.sampleProps} />
        );
    }

}
