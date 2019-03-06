/* @flow */

import * as React from "react";

import ChatResultCardButton from "./ChatResultCardButton";

import type { CardType } from "./ChatMessage";

type Props = {
    card: CardType,
}

export default class ChatResultCard extends React.Component<Props, void> {
    render(): ?React.Element<any> {
        return (
            <div className="ChatResultCard">
                <h3>
                    {this.props.card.title}
                </h3>
                <p>
                    {this.props.card.subtitle}
                </p>
                <div className="ButtonContainer">
                    {
                        this.props.card.buttons.map((button, key) =>
                            <ChatResultCardButton
                                key={key}
                                button={button}
                            />
                        )
                    }
                </div>
            </div>
        )
    }
}
