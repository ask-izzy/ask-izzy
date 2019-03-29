/* @flow */

import * as React from "react";
import ChatQuickReply from "../ChatQuickReply";

import storage from "../../storage";

import type { ContextType as ContextValueType } from "../../pages/ChatPage";

type Props = {
    extraData: Object[],
    parentHandlers: ContextValueType
}

function titleCase(words: string): string {
    return words.split(' ').map(word => (
        `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
    )).join(' ');
}

export default class AmbiguousStateAction extends React.Component<Props, void> {
    sendStateChoice = (location: Object): Function => (): void => {
        this.props.parentHandlers.setProcessing();

        let context = storage.getAllItems();
        context.coordinates = location.centroid;

        this.props.parentHandlers.websocket.send(JSON.stringify({
            cmd: "set_context",
            data: context,
        }));
        this.props.parentHandlers.websocket.send(JSON.stringify({
            cmd: "text",
            data: state,
        }));
    }

    render(): React.Element<any> {
        return (
            <React.Fragment>
                {
                    this.props.extraData.map((location, key) => {
                        const { name: city, state } = location;

                        return (
                            <ChatQuickReply
                                action={titleCase(`${city}, ${state}`)}
                                onClick={this.sendStateChoice(location)}
                                key={key}
                            />
                        )
                    })
                }
            </React.Fragment>
        );
    }
}
