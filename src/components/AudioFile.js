/* @flow */

import * as React from "react";

type Props = {
    src: string,
    hidden: boolean,
    autoplay: boolean,
}

export default class AudioFile extends React.Component<Props, void> {
    static defaultProps = {
        hidden: true,
        autoplay: false,
    };

    render(): React.Element<any> {
        const className = this.props.hidden ? "HiddenAudioFile"
            : "VisibleAudioFile";

        return (
            <div
                className={className}
            >
                <audio
                    autoPlay={this.props.autoplay}
                    controls={true}
                >
                    <source src={this.props.src} />
                </audio>
                <a
                    download="audio.flac"
                    href={this.props.src}
                >
                    Download
                </a>
            </div>
        )
    }
}
