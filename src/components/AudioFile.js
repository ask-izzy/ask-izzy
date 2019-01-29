/* @flow */

import * as React from "react";

type Props = {
    data?: string,
    hidden: boolean,
    autoplay: boolean,
    src?: string,
}

export default class AudioFile extends React.Component<Props, void> {
    _dataUrl: string = "";

    static defaultProps = {
        hidden: true,
        autoplay: false,
    };

    constructor(props: Props): void {
        super(props);

        this._dataUrl = window.URL.createObjectURL(props.data);
    }

    componentWillUnmount(): void {
        window.URL.revokeObjectURL(this._dataUrl);
    }

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
                    <source src={this._dataUrl} />
                </audio>
                <a
                    download="audio.flac"
                    href={this._dataUrl}
                >
                    Download
                </a>
            </div>
        )
    }
}
