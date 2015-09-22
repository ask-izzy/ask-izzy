/* @flow */

import React from 'react';
import Router from 'react-router';
import components from '../components';

export default class StyleGuideList extends React.Component {
    li(componentName: string): ReactElement {
        return (
            <Router.Link
                to="styleguideItem"
                key={componentName}
                params={{componentName: componentName}}
                style={{clear: "both", float: "left"}}
            >{componentName}</Router.Link>
        );
    }

    render(): ReactElement {
        return (
            <ul>
                { Object.keys(components).sort().map(this.li) }
            </ul>
        );
    }

}
