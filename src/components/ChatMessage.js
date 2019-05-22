/* @flow */
/* eslint-disable max-len */

import * as React from "react";

import AudioFile from "./AudioFile";
import ChatQuickReply from "./ChatQuickReply";
import ChatResultCard from "./ChatResultCard";

import LocationAction from "./quickReplyActions/LocationAction";
import AmbiguousStateAction from "./quickReplyActions/AmbiguousStateAction";
import { Context } from "../pages/ChatPage";

import { Service } from "../iss";

interface IXArray<V> extends Array<V> {
    randomElement(): any;
}

export type CardButtonType = {
    text: string,
    postback: string,
}

export type CardType = {
    title: string,
    subtitle: string,
    buttons: CardButtonType[],
    iss_data?: Service,
}

type Props = {
    message: {
        message_type: string,
        output_audio?: string,
        fulfillment_messages: {
            texts: IXArray<string>,
            quick_replies: string[],
            cards: Object[],
            extra: Object,
        }
    },
    onClick?: Function,
    showQuickRepliesIfAvailable: boolean,
    quickReplyCallback?: Function,
    onMessageAnnounceStart?: Function,
    onMessageAnnounceEnd?: Function,
}


export default class ChatMessage extends React.Component<Props, void> {
    static defaultProps = {
        showQuickRepliesIfAvailable: false,
    }

    extraDisplayComponents = {
        "getUserLocation": LocationAction,
        "showUserStates": AmbiguousStateAction,
    }

    clickHandler = (): void => {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    quickReplyHandler = (action: string): Function => (): void => {
        if (this.props.quickReplyCallback) {
            this.props.quickReplyCallback(action);
        }
    }

    onMessageAnnounceStart = (): void => {
        if (this.props.onMessageAnnounceStart) {
            this.props.onMessageAnnounceStart();
        }
    }

    onMessageAnnounceEnd = (): void => {
        if (this.props.onMessageAnnounceEnd) {
            this.props.onMessageAnnounceEnd();
        }
    }

    generateQuickReplies(): ?React.Element<any> {
        let quickReplies = [];

        try {
            quickReplies = this.props.message.fulfillment_messages.quick_replies;
        } catch (err) {
            // We don't need to do anything here.
        }

        if (quickReplies.length) {
            return (
                <div
                    className="QuickReplyContainer"
                    key={2}
                >
                    {
                        quickReplies.map((reply, iter) => (
                            <ChatQuickReply
                                key={`quickreply${iter}`}
                                action={reply}
                                onClick={this.quickReplyHandler(reply)}
                            />
                        ))
                    }
                </div>
            )
        }
    }

    generateExtraDataComponent(): ?React.Element<any> {
        let displayComponent = null;

        displayComponent = this.props.message.fulfillment_messages.extra.webhook_payload.drawComponent;

        if (displayComponent) {
            const Component = this.extraDisplayComponents[displayComponent];

            return (
                <Context.Consumer key={1}>
                    {
                        value => (
                            <div className="QuickReplyContainer">
                                <Component
                                    onSuccess={this.handleExtraDataComponentSuccess}
                                    parentHandlers={value}
                                    showQuickReplies={this.props.showQuickRepliesIfAvailable}
                                />
                            </div>
                        )
                    }
                </Context.Consumer>
            );
        }
    }

    generateResponseCards(): ?React.Element<any>[] {
        try {
            const {
                message: {
                    fulfillment_messages: fulfillmentMessages,
                },
            } = this.props;

            const cards = fulfillmentMessages.cards;

            return cards.map((card, key) => (
                <ChatResultCard
                    key={key}
                    card={{
                        ...card,
                        iss_data: new Service(fulfillmentMessages.extra.webhook_payload.iss_response[key]),
                    }}
                />
            ));
        } catch (exc) {
            return null;
        }
    }

    handleExtraDataComponentSuccess = (data: any): void => {
        console.log(data);
    }

    render(): ?React.Element<any> {
        const {
            message: {
                fulfillment_messages: fulfillmentMessages,
                output_audio: outputAudio,
                message_type: messageType,
            },
        } = this.props;

        try {
            if (!fulfillmentMessages.texts.length || fulfillmentMessages.texts[0] === "") {
                return null;
            }
        } catch (exc) {
            return null;
        }

        let decodedAudio = null;

        if (outputAudio) {
            decodedAudio = outputAudio;
        }

        let output = [(
            <div
                className="ChatMessage"
                onClick={this.clickHandler}
                key={0}
            >
                <div className={messageType}>
                    {
                        decodedAudio && (
                            <AudioFile
                                autoplay
                                hidden
                                src={`data:audio/mpeg;base64,${decodedAudio}`}
                                onAudioStart={this.onMessageAnnounceStart}
                                onAudioEnd={this.onMessageAnnounceEnd}
                            />
                        )
                    }
                    {fulfillmentMessages.texts.randomElement()}
                    {this.generateResponseCards()}
                </div>
            </div>
        )];

        if (this.props.showQuickRepliesIfAvailable) {
            let responses;

            try {
                responses = this.generateExtraDataComponent();
                if (!responses) {
                    responses = this.generateQuickReplies();
                }
            } catch (exc) {
                responses = this.generateQuickReplies();
            }
            output.push(responses);
        }

        return (
            <React.Fragment>
                {output}
            </React.Fragment>
        )
    }
}
