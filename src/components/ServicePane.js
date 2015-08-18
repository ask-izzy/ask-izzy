import React from "react";
import Router from "react-router";
import mui from "material-ui";

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

    renderOtherService(service, idx): React.Element {
        var dateInfo;
        if (service.dates) {
            dateInfo = (
                "only on " + service.dates.join(" and ")
            );
        }

        return (
            <li key={idx} style={{listStyleType: "none"}}>
                <span>{service.name} </span>
                <span style={{
                    backgroundColor: palette.accent2Color,
                }}>{dateInfo}</span>
            </li>
        );
    }

    render(): React.Element {
        return (
            <mui.Paper
                zDepth={1}
            >
                <div style={{padding:10}}>
                    <div>
                        <div style={{
                            float: "left",
                            clear: "both",
                        }}>
                            { this.props.title }
                        </div>
                        <div style={{
                            color: palette.secondaryTextColor,
                            float: "left",
                            clear: "both",
                        }}>
                            { this.props.byline }
                        </div>
                    </div>

                    <div style={{paddingTop: 10}}>
                        <div style={{width: "50%", display: 'inline-block'}}>
                            {/* icon: alarm */}
                            <i className="material-icons">&#xE855;</i>
                            Open now
                        </div>
                        <div style={{width: "50%", display: 'inline-block'}}>
                            {/* icon: directions_transit */}
                            <i className="material-icons">&#xE535;</i>
                            15 mins
                        </div>
                    </div>
                </div>
                <div style={{
                    padding:10,
                    backgroundColor: palette.accent1Color,
                }}>
                    <ul style={{padding:0}} >
                        {this.props.services.map(this.renderOtherService)}
                    </ul>
                </div>
            </mui.Paper>

        );
    }

}
