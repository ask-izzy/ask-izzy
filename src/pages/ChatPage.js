/* @flow */
/* eslint-disable max-len */

import * as React from "react";
import Recorder from "recorder-js";

import StaticPage from "./StaticPage";
import ChatMessage from "../components/ChatMessage";
import AudioFile from "../components/AudioFile";

import SoundMeter from "../utils/soundmeter";

type State = {
    analysedAudio: Array<number>,
    messages: Array<Object>,
    instantLevel: number,
    slowLevel: number,
    isRecording: boolean,
    showWebsocketReconnect: boolean,
    isProcessing: boolean,
    showTalkButton: boolean,
    soundBuffer: Float32Array,
}

export default class ChatPage extends React.Component<{}, State> {
    _websocket: ?WebSocket;
    _volumeInterval: ?IntervalID;
    _audioContext: ?AudioContext;
    _soundMeter: ?SoundMeter;
    _mediaRecorder: ?Recorder;

    _audioCaptureThreshold: number = 0.05;
    _audioFiles = [];

    constructor(props): void {
        super(props)

        this.state = {
            analysedAudio: [0, 0, 0],
            messages: [],
            instantLevel: 0,
            slowLevel: 0,
            isRecording: false,
            showWebsocketReconnect: false,
            isProcessing: false,
            showTalkButton: true,
            soundBuffer: new Float32Array(4096),
        };
    }

    componentDidMount(): void {
        this.connectWebsocket();
    }

    connectWebsocket(): void {
        if (!this._websocket || this._websocket.readyState > 1) {
            // this._websocket = new WebSocket("ws://localhost:8000/ws/askizzy/");
            this._websocket = new WebSocket("ws://10.51.21.49:8000/ws/askizzy/");

            this._websocket.onmessage = function(frame) {
                const data = JSON.parse(frame.data);

                this.setState({
                    messages: [...this.state.messages, data],
                    isProcessing: false,
                });
            }.bind(this);

            this._websocket.onclose = function(err) {
                this.setState({ showWebsocketReconnect: true });
                console.error("Chat socket closed unexpectedly.", err);
                this._websocket = undefined;
            }.bind(this);
        }
    }

    async componentWillUnmount(): Promise<void> {
        if (this._volumeInterval) {
            clearInterval(this._volumeInterval);
        }
        if (this._soundMeter) {
            this._soundMeter.stop();
        }
        if (this._mediaRecorder && this.state.isRecording) {
            this._mediaRecorder.stop();
        }
        if (this._audioContext) {
            await this._audioContext.close();
        }
        if (this._websocket) {
            this._websocket.close();
        }
    }

    startVoiceChat(): void {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this._audioContext = new AudioContext();
        } catch (err) {
            console.error("Web Audio API not supported.");
        }

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(this.handleSuccess.bind(this)).catch(this.handleError.bind(this));
    }

    handleError(error): void {
        console.log("navigator.getUserMedia error: ", JSON.stringify(error));
        this.setState({ showTalkButton: true });
    }

    handleSuccess(stream): void {
        this.setState({ showTalkButton: false });

        console.log("Media Recorder starting");
        this._mediaRecorder = new Recorder(this._audioContext, {
            nFrequencyBars: 3,
            onAnalysed: data => {
                this.setState({ analysedAudio: data })
            },
            microphoneConfig: {
                numChannels: 1,
            },
        });
        this._mediaRecorder.init(stream);

        this._soundMeter = new SoundMeter(this._audioContext);
        this._soundMeter.connectToSource(
            stream,
            this.handleAudioSource.bind(this)
        );

        this._encoder = new Worker("/static/scripts/encoder.js");
        this._encoder.onmessage = function(msg) {
            if (msg.data.cmd === "end") {
                const blob = msg.data.buf;
                const reader = new FileReader();

                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    const base64 = reader.result.split(",")[1];

                    if (this._websocket) {
                        this._websocket.send(JSON.stringify({
                            audio: base64,
                        }));
                    }
                }.bind(this)

                this._audioFiles.push((
                    <AudioFile
                        hidden={false}
                        src={window.URL.createObjectURL(blob)}
                    />
                ));
            }
        }.bind(this)
    }

    float32Concat(first, second): Float32Array {
        const firstLength = first.length;
        let result = new Float32Array(firstLength + second.length);

        result.set(first);
        result.set(second, firstLength);

        return result;
    }

    handleAudioCaptureFinished(data): void {
        const { buffer } = data;

        this.setState({ isProcessing: true });

        const joinedBuffers = this.float32Concat(this.state.soundBuffer, buffer[0]);

        this._encoder.postMessage({
            cmd: "encode",
            buf: joinedBuffers,
        });
    }

    handleAudioSource(err): void {
        if (err) {
            console.error("There was an error.", e);
            return;
        }

        this._volumeInterval = setInterval(() => {
            const instantLevel = Math.round(this._soundMeter.instant * 100) / 100;
            const slowLevel = Math.round(this._soundMeter.slow * 100) / 100;

            this.setState({
                instantLevel,
                slowLevel,
            });

            if (slowLevel >= this._audioCaptureThreshold) {
                if (this._mediaRecorder && !this.state.isRecording) {
                    this.setState({
                        isRecording: true,
                        soundBuffer: this._soundMeter.buffer,
                    });

                    this._encoder.postMessage({
                        cmd: "init",
                        config: {
                            samplerate: 44100,
                            bps: 16,
                            channels: 1,
                            compression: 5,
                        },
                    });

                    this._mediaRecorder.start();
                }
            }
            if (slowLevel < this._audioCaptureThreshold) {
                if (this._mediaRecorder && this._encoder && this.state.isRecording) {
                    this._mediaRecorder.stop().then(data => {
                        this.setState({ isRecording: false });
                        this.handleAudioCaptureFinished(data);
                    });
                }
            }
        }, 200);
    }

    render(): React.Element<any> {
        return (
            <StaticPage
                title="Chat to Izzy"
                bannerName="chat static"
                className="ChatPage"
            >
                <div className="MessageContainer">
                    {
                        !this._websocket || (
                            this._websocket.readyState === 0 && (
                                <ChatMessage
                                    message={{
                                        message_type: "to",
                                        body: "Connecting to server...",
                                    }}
                                />
                            )
                        )
                    }
                    {
                        this.state.messages.map(message => {
                            return (
                                <ChatMessage message={message} />
                            );
                        })
                    }
                    {
                        this.state.showWebsocketReconnect && (
                            <ChatMessage
                                message={{
                                    message_type: "to",
                                    body: "You've been disconnected. Click here to reconnect.",
                                }}
                                onClick={this.connectWebsocket.bind(this)}
                            />
                        )
                    }
                </div>
                {
                    this.state.isProcessing && (
                        <div className="lds-dual-ring" />
                    )
                }
                {
                    this.state.showTalkButton && (
                        <div
                            className="TalkButton"
                            onClick={this.startVoiceChat.bind(this)}
                        >
                            Talk
                        </div>
                    )
                }
            </StaticPage>
        );
    }
}
