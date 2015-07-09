/* @flow */

var React = require("react");
module.exports = function(container: Element) {
    React.render(
        require("./components/test.jsx"),
        container
    );
}
