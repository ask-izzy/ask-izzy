require("!style!css!./styles/style.css");

// TODO: This will need to map server-rendered bits
// to client-rendered bits or nothing will really work
// properly.
// Or can it use virtualdom diffing to avoid that?
// Maybe that's why you have to pass in the existing
// DOM to the renderer - lets it do a partial update.
// Will have to read up a bit.
window.onload = function() {
    var React = require("react");
    var container = document.body.parentElement;
    React.render(
        require("./index"),
        container
    );
}
