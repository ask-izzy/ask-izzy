
import React, { PropTypes, Component } from "react";
import { connectToStores } from "fluxible-addons-react";
import { NavLink } from "fluxible-router";

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

import categories from "../constants/categories";
import mui from "material-ui";
var RaisedButton = mui.RaisedButton;
@connectToStores([], (context) =>
    ({ route: context.getStore("RouteStore").getCurrentRoute() })
)
class NavBar extends Component {

    static PropTypes = {
        route: PropTypes.object.isRequired,
    }

    render() {
        const { route } = this.props;
        return (
            <div className="NavBar">
                <RaisedButton label="Default" />
                <div className="NavBar-title">
                    <NavLink href="/">
                    </NavLink>
                </div>
                <List
                    style={{width: "100%"}}
                >
                    {
                        Object.keys(categories).map(category => {
                            return (
                                <ListItem
                                    key={category}
                                    primaryText={
                                        <NavLink
                                            key={category}
                                            className="NavBar-link"
                                            routeName="category"
                                            navParams={{
                                                category: categories[category],
                                            }}>
                                            {category}
                                        </NavLink>
                                    }
                                />

                            );
                        })
                    }
                </List>
                <div className="NavBar-locales">
                </div>
            </div>
        );
    }

}

export default NavBar;
