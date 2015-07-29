import React from "react";
import Router from "react-router";
import mui from "material-ui";
import Chevron from "./Chevron";

export default class CategoryListItem extends React.Component {

    render(): React.Element {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                { this.props.children }
                <Chevron />
            </div>
        );
    }

}
