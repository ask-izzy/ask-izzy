import React from "react";
import Router from "react-router";
import mui from "material-ui";
import HeaderWithChevron from "./HeaderWithChevron";

import colors from "../constants/theme";
var palette = colors.getPalette();

export default class ServicePane extends React.Component {

    static sampleProps = {
        title: "Frontyard Youth Services",
        byline: "Melbourne City Mission",
        services: [{
            name: "Accommodation referral",
            relevance: "primary",
        },{
            name: "Centerlink",
        },{
            name: "Youth connections",
        },{
            name: "Podiatrist",
            dates: ["16/06/15"],
        },{
            name: "Legal advice",
        },{
            name: "Health services",
        },{
            name: "Family reconciliation and mediation",
        },{
            name: "Assessment and referral",
        },{
            name: "Dentistry",
            relevance: "newService",
        },{
            name: "Young & Pregnant Parenting",
        },{
            name: "Job Services Australia",
        },],
    }

    render(): React.Element {
        return (
            <mui.Paper
                zDepth={1}
            >
            </mui.Paper>

        );
    }

}
