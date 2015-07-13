/* @flow */

var React = require("react");
module.exports = React.createClass({
    render: function(): React.Element {
        return(
            <h2>hi there {JSON.stringify( this.props ) }</h2>
        );
    }
});
