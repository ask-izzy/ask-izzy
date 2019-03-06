/* @flow */

import * as React from "react";

import sendEvent from "../../google-tag-manager";
import Geolocation, {guessSuburb} from "../../geolocation";

import ChatQuickReply from "../ChatQuickReply";

import type { ContextType as ContextValueType } from "../../pages/ChatPage";

type Props = {
    onSuccess: Function,
    parentHandlers: ContextValueType,
}

type State = {
    geolocation: "NOT_STARTED"|"RUNNING"|"COMPLETE"|"FAILED",
    error: ?string,
}

export default class LocationAction extends React.Component<Props, State> {
    constructor(props: Props): void {
        super(props)

        this.state = {
            geolocation: "NOT_STARTED",
            error: null,
        }
    }

    async locateMe(): Promise<Object> {
        let location = await Geolocation();
        let name = await guessSuburb(location);

        return {name, coords: location.coords};
    }

    handleLocationSuccess(location: { name: string, coords: Object }): void {
        this.props.parentHandlers.setProcessing();
        this.props.parentHandlers.websocket.send(JSON.stringify({
            cmd: 'text',
            data: location.name,
        }));
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

                this.handleLocationSuccess(params);
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
        return this.state.geolocation === "NOT_STARTED" ? (
            <ChatQuickReply
                action="Enable my location"
                onClick={this.getUserLocation.bind(this)}
            />
        ) : (
            <div className="lds-dual-ring" />
        )
    }
}
