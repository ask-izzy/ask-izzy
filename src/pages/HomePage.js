/* @flow */

import React from "react";
import { History } from "react-router";
import reactMixin from "react-mixin";

import HeaderBar from "../components/HeaderBar";
import BrandedHeader from "../components/BrandedHeader";
import NavBar from "../components/NavBar";
import icons from "../icons";

/*::`*/@reactMixin.decorate(History)/*::`;*/
class HomePage extends React.Component {

    onSearchSubmit(event: Event): void {
        event.preventDefault();

        const search = this.refs.search.getDOMNode().value;

        if (search == "") {
            /* FIXME: should this give some user feedback? */
            return;
        }

        this.props.history.pushState(
            null,
            `/search/${encodeURIComponent(search)}`,
            {}
        );
    }

    render(): ReactElement {
        return (
            <div className="HomePage">
                <div className="header">
                    <BrandedHeader />
                    <HeaderBar
                        primaryText="What do you need?"
                        secondaryText="Select a category or search"
                    >
                        <form
                            className="search"
                            onSubmit={this.onSearchSubmit.bind(this)}
                        >
                            <input
                                ref="search"
                                type="search"
                                placeholder="Search"
                            />
                            <icons.Search
                                className="icon"
                                onTouchTap={this.onSearchSubmit.bind(this)}
                            />
                        </form>
                    </HeaderBar>
                </div>

                <div className="body">
                    <NavBar />
                </div>
            </div>
        );
    }

}

export default HomePage;
