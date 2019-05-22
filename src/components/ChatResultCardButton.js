/* @flow */

import * as React from "react";

import type { CardButtonType } from "./ChatMessage";

type Props = {
    button: CardButtonType,
}

class ChatResultCardButton extends React.Component<Props, void> {
    handleButtonPress = (): void => {
        window.open(this.props.button.postback, "_blank");
    }

    render(): ?React.Element<any> {
        return (
            <button
                className="ChatResultCardButton"
                onClick={this.handleButtonPress}
            >
                {this.props.button.text}
            </button>
        )
    }
}

export default ChatResultCardButton
