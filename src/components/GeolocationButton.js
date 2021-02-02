/* @flow */

import React from "react";
import ButtonListItem from "./ButtonListItem";
import ListItem from "./ListItem";
import Geolocation, {guessSuburb} from "../geolocation";
import Cross from "../icons/cross.svg";
import Location from "../icons/location.svg";
import Loading from "../icons/loading.svg";
import Tick from "../icons/tick.svg";
import sendEvent from "../google-tag-manager";

type GeoLocationState = "NOT_STARTED"|"RUNNING"|"COMPLETE"|"FAILED";

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
            <Location
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
            <Loading className="big" />
        }
    />
);

const FinishedGeolocation = () => (
    <ListItem
        className="taller"
        primaryText="Found your location"
        leftIcon={<Tick className="big" />}
    />
);

type FailedGeolocationProps = {
    error: string
}

class FailedGeolocation extends React.Component<FailedGeolocationProps, void> {
    render() {
        return (
            <ListItem
                primaryText="Unable to get your location"
                secondaryText={`Please enter your location below
                    (${this.props.error})`}
                leftIcon={<Cross className="big" />}
            />
        );
    }
}

type GeolocationButtonProps = {
    onSuccess: (result: { name: string, coords: Coordinates }) => void,
}

type GeolocationButtonState = {
    geolocation: GeoLocationState,
    error?: string
}

// eslint-disable-next-line max-len
class GeolocationButton extends React.Component<GeolocationButtonProps, GeolocationButtonState> {
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
        if (this.state.geolocation === "RUNNING") {
            return <RunningGeolocation />;
        } else if (this.state.geolocation === "COMPLETE") {
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
