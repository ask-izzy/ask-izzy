/* @flow */
import React from "react";
import fixtures from "../../fixtures/services";
import Location from "../iss/Location";

class GoogleMapsLink extends React.Component {

    // flow:disable not supported yet
    static sampleProps = {
        default: {
            children: (
                <div>Link text</div>
            ),
            location: new Location(fixtures.ixa.location),
        },
    };


    render(): ReactElement {
        if (this.props.location.isConfidential()) {
            return (
                <span {...this.props} >
                    {this.props.children}
                </span>
            );
        }

        return (
            <a
                target="_blank"
                aria-label="Open Google Maps in a new tab"
                href={this.props.location.googleMapsUrl()}
                {...this.props}
            >
                    {this.props.children}
            </a>
        );
    }

}

export default GoogleMapsLink;
