/* @flow */
/* eslint-disable max-len */

import * as React from "react";

import AudioFile from "./AudioFile";
import ChatQuickReply from "./ChatQuickReply";

import LocationAction from "./quickReplyActions/LocationAction";

interface IXArray<V> extends Array<V> {
    randomElement(): any;
}

type Props = {
    message: {
        message_type: string,
        output_audio?: string,
        fulfillment_messages: {
            texts: IXArray<string>,
            quick_replies: Array<string>,
            cards: Array<Object>,
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
        'getUserLocation': LocationAction,
    }

    clickHandler(): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    quickReplyHandler(action: string): void {
        if (this.props.quickReplyCallback) {
            this.props.quickReplyCallback(action);
        }
    }

    onMessageAnnounceStart(): void {
        if (this.props.onMessageAnnounceStart) {
            this.props.onMessageAnnounceStart();
        }
    }

    onMessageAnnounceEnd(): void {
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
                <div className="QuickReplyContainer">
                    {
                        quickReplies.map((reply, iter) => (
                            <ChatQuickReply
                                key={`quickreply${iter}`}
                                action={reply}
                                onClick={this.quickReplyHandler.bind(this, reply)}
                            />
                        ))
                    }
                </div>
            )
        }
    }

    generateExtraDataComponent(): ?React.Element<any> {
        let displayComponent = null;

        try {
            displayComponent = this.props.message.fulfillment_messages.extra.webhook_payload.drawComponent;
        } catch (err) {
            // We don't need to do anything here.
        }

        if (displayComponent) {
            const Component = this.extraDisplayComponents[displayComponent];

            return (
                <div className="QuickReplyContainer">
                    <Component
                        onSuccess={this.handleExtraDataComponentSuccess.bind(this)}
                    />
                </div>
            );
        }
    }

    handleExtraDataComponentSuccess(data): void {
        console.log(data)
    }

    render(): ?React.Element<any> {
        try {
            if (!this.props.message.fulfillment_messages.texts.length || this.props.message.fulfillment_messages.texts[0] === "") {
                return null;
            }
        } catch (exc) {
            return null;
        }

        let decodedAudio = null;

        if (this.props.message.output_audio) {
            decodedAudio = this.props.message.output_audio;
        }

        let output = [(
            <div
                className="ChatMessage"
                onClick={this.clickHandler.bind(this)}
            >
                <div className={this.props.message.message_type}>
                    {
                        decodedAudio && (
                            <AudioFile
                                autoplay={true}
                                hidden={true}
                                src={`data:audio/mpeg;base64,${decodedAudio}`}
                                onAudioStart={this.onMessageAnnounceStart.bind(this)}
                                onAudioEnd={this.onMessageAnnounceEnd.bind(this)}
                            />
                        )
                    }
                    {this.props.message.fulfillment_messages.texts.randomElement()}
                </div>
            </div>
        )];

        if (this.props.showQuickRepliesIfAvailable) {
            try {
                output.push(this.generateExtraDataComponent());
            } catch (exc) {
                output.push(this.generateQuickReplies());
            }
        }

        return (
            <React.Fragment>
                {output}
            </React.Fragment>
        )
    }
}
