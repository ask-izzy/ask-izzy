/* @flow */

import * as React from "react";

type Props = {
    audioData: Array<number>,
}

class ChatInputVolumeDisplay extends React.Component<Props, void> {
    render(): React.Element<any> {
        return (
            <div className="InputVolumeDisplayContainer">
                {
                    this.props.audioData.map((barHeight, iter) => (
                        <div
                            className="InputVolumeDisplayBar"
                            style={{
                                height: (50 * barHeight) + 1,
                            }}
                        />
                    ))
                }
            </div>
        )
    }
}

export default ChatInputVolumeDisplay;
