/* @flow */

var React = require('react');
var components = require('./components/components');

module.exports = React.createClass({
    render: function(): React.Element {
        var path : string = this.props.path;
        var routeParams = {}
        var Content : React.Component = components.CategoryList;
        var categoryRegexp = new RegExp("/categories/([^/]+)/?$");
        if (path.match(categoryRegexp)) {
            routeParams.category = path.match(categoryRegexp)[1];
        }

        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                </head>
                <body>
                    <Content routeParams={routeParams} />
                    <script
                        type="text/javascript"
                        src="/bundle.js"
                        charSet="utf-8"
                    />
                </body>
            </html>
        )
    }
})
