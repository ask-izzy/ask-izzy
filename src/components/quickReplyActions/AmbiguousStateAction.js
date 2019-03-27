/* @flow */

import * as React from "react";
import ChatQuickReply from "../ChatQuickReply";

import type { ContextType as ContextValueType } from "../../pages/ChatPage";

type Props = {
    states: string[],
    parentHandlers: ContextValueType
}

export default class AmbiguousStateAction extends React.Component<Props, void> {
    sendStateChoice(state: string): void {
        this.props.parentHandlers.setProcessing();
        this.props.parentHandlers.websocket.send(JSON.stringify({
            cmd: "text",
            data: state,
        }));
    }

    render(): React.Element<any> {
        return (
            <React.Fragment>
                {
                    this.props.states.map((state, key) => (
                        <ChatQuickReply
                            action={state}
                            onClick={this.sendStateChoice.bind(this, state)}
                            key={key}
                        />
                    ))
                }
            </React.Fragment>
        );
    }
}
