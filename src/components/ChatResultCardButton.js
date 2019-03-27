/* @flow */

import * as React from "react";

import type { CardButtonType } from "./ChatMessage";

type Props = {
    button: CardButtonType,
}

class ChatResultCardButton extends React.Component<Props, void> {
    handleButtonPress(): void {
        window.location = this.props.button.postback;
    }

    render(): ?React.Element<any> {
        return (
            <button
                className="ChatResultCardButton"
                onClick={this.handleButtonPress.bind(this)}
            >
                {this.props.button.text}
            </button>
        )
    }
}

export default ChatResultCardButton
