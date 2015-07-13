/* @flow */

var React = require("react");
module.exports = React.createClass({
    render: function(): React.Element {
        return(
            <h2>Category list
            hi there { this.props.routeParams.category }</h2>
        );
    }
});
