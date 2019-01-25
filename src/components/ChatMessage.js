/* @flow */

import * as React from "react";

import AudioFile from "./AudioFile";

type Props = {
    message: {
        message_type: string,
        body: string,
    },
    onClick?: Function,
}

export default class ChatMessage extends React.Component<Props, void> {
    clickHandler(): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render(): React.Element<any> {
        if (this.props.message.body === "") {
            return null;
        }

        let decodedAudio = null;

        if (this.props.message.output_audio) {
            decodedAudio = this.props.message.output_audio;
        }

        return (
            <div
                className={`ChatMessage ${this.props.message.message_type}`}
                onClick={this.clickHandler.bind(this)}
            >
                {
                    decodedAudio && (
                        <AudioFile
                            autoplay={true}
                            hidden={true}
                            src={`data:audio/mpeg;base64,${decodedAudio}`}
                        />
                    )
                }
                {this.props.message.body}
            </div>
        );
    }
}
