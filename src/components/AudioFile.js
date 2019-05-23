/* @flow */

import * as React from "react";

type Props = {
    onAudioStart?: Function,
    onAudioEnd?: Function,
    audioContext: ?AudioContext,
    decodedAudio: string,
}

export default class AudioFile extends React.Component<Props, void> {
    _audioElement: ?React.Element<any>;

    componentDidMount(): void {
        if (this.props.audioContext && this.props.decodedAudio) {
            const { audioContext } = this.props;

            const onAudioDecodeSuccess = audioBuffer => {
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                this.onAudioStart();
                source.onended = ():void => {
                    this.onAudioEnd();
                };
                source.start();
            }

            const onAudioDecodeFailure = err => {
                console.error(err)
            }

            this.props.audioContext.decodeAudioData(
                Uint8Array.from(atob(this.props.decodedAudio), (c: number) => String(c).charCodeAt(0)).buffer,
                onAudioDecodeSuccess,
                onAudioDecodeFailure
            )
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
        return <React.Fragment />
    }
}
