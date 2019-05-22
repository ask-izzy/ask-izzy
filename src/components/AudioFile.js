/* @flow */

import * as React from "react";

type Props = {
    data?: string,
    hidden: boolean,
    autoplay: boolean,
    src?: string,
    onAudioStart?: Function,
    onAudioEnd?: Function,
    forwardRef?: Function,
    audioContext: ?AudioContext,
}

export default class AudioFile extends React.Component<Props, void> {
    _dataUrl: string = "";
    _audioElement: ?React.Element<any>;

    static defaultProps = {
        hidden: true,
        autoplay: false,
    };

    constructor(props: Props): void {
        super(props);

        if (props.src) {
            this._dataUrl = props.src;
        } else {
            this._dataUrl = window.URL.createObjectURL(props.data);
        }
    }

    componentDidMount(): void {
        if (this.props.audioContext && this.props.decodedAudio) {
            this.props.audioContext.decodeAudioData(
                Uint8Array.from(atob(this.props.decodedAudio), c => c.charCodeAt(0)).buffer,
                audioBuffer => {
                    const source = this.props.audioContext.createBufferSource()
                    source.buffer = audioBuffer
                    source.connect(this.props.audioContext.destination)
                    source.start()
                    console.log(source)
                }
            )
        }
    }

    componentWillUnmount(): void {
        try {
            window.URL.revokeObjectURL(this._dataUrl);
        } catch (err) {
            // This mightn't be a browser created object URL, so we can
            // ignore this error.
        }
    }

    onAudioStart = (): void => {
        if (this.props.onAudioStart) {
            this.props.onAudioStart();
        }
    }

    onAudioEnd = (): void => {
        if (this.props.onAudioEnd) {
            this.props.onAudioEnd();
        }
    }

    render(): React.Element<any> {
        const className = this.props.hidden ? "HiddenAudioFile"
            : "VisibleAudioFile";

        return <React.Fragment />

        return (
            <div
                className={className}
            >
                <audio
                    autoPlay={this.props.autoplay}
                    controls={true}
                    onEnded={this.onAudioEnd}
                    onPlay={this.onAudioStart}
                    ref={this.props.forwardRef}
                >
                    <source src={this._dataUrl} />
                </audio>
                <a
                    download="audio.mpeg"
                    href={this._dataUrl}
                >
                    Download
                </a>
            </div>
        )
    }
}
