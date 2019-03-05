import React from "react";

import sendEvent from "../../google-tag-manager";
import Geolocation, {guessSuburb} from "../../geolocation";

import ChatQuickReply from "../ChatQuickReply";

type Props = {
    onSuccess: Function,
}

type State = {
    geolocation: "NOT_STARTED"|"RUNNING"|"COMPLETE"|"FAILED",
}

export default class LocationAction extends React.Component<Props, State> {
    constructor(props): void {
        super(props)

        this.state = {
            geolocation: "NOT_STARTED",
        }
    }

    async locateMe(): Promise<Object> {
            let location = await Geolocation();
            let name = await guessSuburb(location);

        return {name, coords: location.coords};
    }

    getUserLocation(): void {
        if (this.state.geolocation !== "NOT_STARTED") {
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

    render(): ?React.Element<any> {
        return (
            <ChatQuickReply
                action="Enable my location"
                onClick={this.getUserLocation.bind(this)}
            />
        )
    }
}
