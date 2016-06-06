/* @flow */

import React from "react";
import ButtonListItem from "./ButtonListItem";
import ListItem from "./ListItem";
import Geolocation, {guessSuburb} from "../geolocation";
import icons from "../icons";
import sendEvent from "../google-tag-manager";

type GeoLocationState = "NOT_STARTED"|"RUNNING"|"COMPLETE"|"FAILED"

const NotStartedGeolocation = (props) => (
    <ButtonListItem
        className="taller LocationButton"
        onClick={props.onClick}
        primaryText={
            <span className="link-color link-text">
                Get your current location
            </span>
        }
        leftIcon={
            <icons.Location
                className="ColoredIcon icon-fg-color big"
            />
        }
    />
);

const RunningGeolocation = () => (
    <ListItem
        primaryText="Locating you..."
        secondaryText="Please permit us to use your GPS"
        leftIcon={
            <icons.Loading className="big" />
        }
    />
);

const FinishedGeolocation = () => (
    <ListItem
        className="taller"
        primaryText="Found your location"
        leftIcon={<icons.Tick className="big" />}
    />
);

class FailedGeolocation extends React.Component {
    props: {error: string};
    state: void;
    render() {
        return (
            <ListItem
                primaryText="Unable to get your location"
                secondaryText={`Please enter your location below
                    (${this.props.error})`}
                leftIcon={<icons.Cross className="big" />}
            />
        );
    }
}

class GeolocationButton extends React.Component {
    props: Object;
    state: {
        geolocation: GeoLocationState,
        error?: string
    };
    static sampleProps = {
        default: {},
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            geolocation: "NOT_STARTED",
        };
    }

    async locateMe(): Promise<Object> {
        let location = await Geolocation();
        let name = await guessSuburb(location);

        return {name, coords: location.coords};
    }

    onGeolocationClick(): void {
        if (this.state.geolocation != "NOT_STARTED") {
            return;
        }

        this.setState({
            geolocation: "RUNNING",
        });
        sendEvent({event: "geolocation-requested"});

        this.locateMe()
            .then((params) => {
                this.setState({geolocation: "COMPLETE"});
                sendEvent({event: "geolocation-success"});

                this.props.onSuccess(params);
            })
            .catch(error => {
                sendEvent({
                    event: "geolocation-failed",
                    message: error.message,
                });
                console.error(error);
                this.setState({
                    geolocation: "FAILED",
                    error: error.message,
                });
            });
    }

    render() {
        if (this.state.geolocation == "RUNNING") {
            return <RunningGeolocation />;
        } else if (this.state.geolocation == "COMPLETE") {
            return <FinishedGeolocation />;
        } else if (this.state.error) {
            return <FailedGeolocation error={this.state.error}/>;
        } else {
            return (
                <NotStartedGeolocation
                    onClick={this.onGeolocationClick.bind(this)}
                />
            );
        }
    }

}

export default GeolocationButton;
