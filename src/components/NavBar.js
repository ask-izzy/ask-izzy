
import React, { PropTypes, Component } from "react";
import { connectToStores } from "fluxible-addons-react";
import { NavLink } from "fluxible-router";

import categories from "../constants/categories";

@connectToStores([], (context) =>
    ({ route: context.getStore("RouteStore").getCurrentRoute() })
)
class NavBar extends Component {

    static PropTypes = {
        route: PropTypes.object.isRequired,
    }

    render() {
        const { route } = this.props;
        const currentCategory =
            route ? route.getIn(["params", "category"]) : null;
        return (
            <div className="NavBar">
                <div className="NavBar-title">
                    <NavLink href="/">
                    </NavLink>
                </div>
                <div className="NavBar-links">
                    {
                        Object.keys(categories).map(category => {
                            return (
                                <NavLink
                                    key={category}
                                    className="NavBar-link"
                                    activeClass="NavBar-link--selected"
                                    routeName="category"
                                    navParams={{
                                        category: categories[category],
                                    }}>
                                    {category}
                                </NavLink>
                            );
                        })
                    }
                </div>
                <div className="NavBar-locales">
                </div>
            </div>
        );
    }

}

export default NavBar;
