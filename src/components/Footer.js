import React, { Component } from "react";
import { NavLink } from "fluxible-router";

class Footer extends Component {

    render() {
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
