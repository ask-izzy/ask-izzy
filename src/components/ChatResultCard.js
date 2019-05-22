/* @flow */

import * as React from "react";

import ChatResultCardButton from "./ChatResultCardButton";
import ErrorCapture from "./ErrorCapture";
import MobileDetect from "./higherorder/MobileDetect";

import type { CardType } from "./ChatMessage";

type Props = {
    card: CardType,
    mobileView: boolean,
}

class ChatResultCard extends React.Component<Props, void> {
    render(): ?React.Element<any> {
        const {
            card: {
                buttons,
                title,
                subtitle,
                iss_data: issData,
            },
        } = this.props;

        return (
            <div className="ChatResultCard">
                <h3>
                    {title}
                </h3>
                <p>
                    {subtitle}
                </p>
                <ErrorCapture data={issData}>
                    {
                        ({ caughtError, data }) => {
                            const phoneNumber = data.Phones()[0].number;

                            if (!caughtError) {
                                return (
                                    <React.Fragment>
                                        <hr />
                                        {data.Phones()[0].comment}<br />
                                        {
                                            this.props.mobileView ? (
                                                <a href={`tel:${phoneNumber}`}>
                                                    {phoneNumber}
                                                </a>
                                            ) : phoneNumber
                                        }
                                        <hr />
                                    </React.Fragment>
                                )
                            }
                        }
                    }
                </ErrorCapture>
                <div className="ButtonContainer">
                    {
                        buttons.map((button, key) =>
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

export default MobileDetect(ChatResultCard);
