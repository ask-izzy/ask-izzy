/* @flow */
import React from "react";
import { NavLink } from "fluxible-router";

class Footer extends React.Component {

    render(): React.Element {
        return (
            <div className="Footer">
                <div className="Footer-disclaimer">
                    Data copyright
                    <a href="https://www.infoxchange.net.au/">infoXchange</a>
                </div>
            </div>
        );
    }

}

export default Footer;
