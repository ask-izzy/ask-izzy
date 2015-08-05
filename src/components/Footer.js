import React from "react";
import mui from "material-ui";
class Footer extends React.Component {

    static contextTypes = {
        muiTheme: React.PropTypes.object,
    }

    render(): React.Element {
        var themeVariables = this.context.muiTheme.component.appBar;

        // FIXME: Style copied from material-ui/app-bar.js
        return (
            <div className="Footer">
                <div className="Footer-disclaimer">
                    <span>Data copyright </span>
                    <a href="https://www.infoxchange.net.au/">infoxchange</a>
                </div>
            </div>
        );
    }

}

export default Footer;
