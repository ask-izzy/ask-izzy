import React from "react";
import Router from "react-router";
import mui from "material-ui";
import HeaderWithChevron from "./HeaderWithChevron";

export default class CategoryListItem extends React.Component {

    render(): React.Element {
        return (
            <Router.Link
                to="category"
                params={{
                    categoryName: this.props.categoryKey,
                }}
                style={{
                    textDecoration: "none",
                    fontSize: 24,
                }}
            >
                <mui.Paper
                    zDepth={1}
                    style={{padding: 10}}
                >
                    <HeaderWithChevron>
                        <i
                            className="material-icons"
                        >
                            {/* FIXME: This is hardcoded */}
                            {/* icon: store_mall_directory */}
                            &#xE563;
                        </i>
                        <span>{ this.props.description }</span>
                    </HeaderWithChevron>
                </mui.Paper>

            </Router.Link>

        );
    }

}
CategoryListItem.sampleProps = {
    categoryKey: "material-aid",
    description: "Material Aid",
    byline: "Clothes and other goods",
    iconUrl: "",
};
