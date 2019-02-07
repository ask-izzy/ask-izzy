/* flow:disable */
/* eslint-disable max-len */

import * as React from "react";
import Recorder from "recorder-js";

import StaticPage from "./StaticPage";
import ChatMessage from "../components/ChatMessage";
import DebugContainer from "../components/DebugContainer";
import DebugChatMessages from "../components/DebugChatMessages";
import AudioFile from "../components/AudioFile";

import SoundMeter from "../utils/soundmeter";
import ChatInputVolumeDisplay from "../components/ChatInputVolumeDisplay";

type State = {
    analysedAudio: Array<number>,
    messages: Array<Object>,
    instantLevel: number,
    slowLevel: number,
    isRecording: boolean,
    showWebsocketReconnect: boolean,
    isProcessing: boolean,
    isMessagePlaying: boolean,
    showTalkButton: boolean,
    soundBuffer: Float32Array,
    showErrorMessage: boolean,
}

export default class ChatPage extends React.Component<{}, State> {
    _websocket: ?WebSocket;
    _volumeInterval: ?IntervalID;
    _audioContext: ?AudioContext;
    _soundMeter: ?SoundMeter;
    _mediaRecorder: ?Recorder;
    _encoder: ?Worker;

    _audioCaptureThreshold: number = 0.05;
    _audioFiles = [];

    constructor(props: {}): void {
        super(props)

        this.state = {
            analysedAudio: (new Array(5)).fill(0),
            messages: [],
            instantLevel: 0,
            slowLevel: 0,
            isRecording: false,
            isMessagePlaying: false,
            showWebsocketReconnect: false,
            isProcessing: false,
            showTalkButton: true,
            soundBuffer: new Float32Array(),
            showErrorMessage: false,
        };
    }

    componentDidMount(): void {
        this.connectWebsocket();
    }

    connectWebsocket(): void {
        if (!this._websocket || this._websocket.readyState > 1) {
            this._websocket = new WebSocket(window.SPEECH_SERVER_URL);

            this._websocket.onmessage = function(frame: {data: mixed}) {
                const data = JSON.parse(frame.data);

                this.setState({
                    messages: [...this.state.messages, data],
                    isProcessing: false,
                });
            }.bind(this);

            this._websocket.onclose = function(err) {
                this.setState({
                    showWebsocketReconnect: true,
                    isProcessing: false,
                });
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
            .then(this.handleSuccess.bind(this))
            .catch(this.handleError.bind(this));
    }

    handleError(error): void {
        console.log("navigator.getUserMedia error: ", JSON.stringify(error));
        this.setState({ showErrorMessage: true, showTalkButton: true });
    }

    handleSuccess(stream): void {
        this.setState({ showTalkButton: false });

        console.log("Media Recorder starting");
        this._mediaRecorder = new Recorder(this._audioContext, {
            nFrequencyBars: 3,
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
                        data={blob}
                    />
                ));
            }
        }.bind(this)
    }

    float32Concat(first: Float32Array, second: Float32Array): Float32Array {
        const firstLength = first.length;
        let result = new Float32Array(firstLength + second.length);

        result.set(first);
        result.set(second, firstLength);

        return result;
    }

    handleAudioCaptureFinished(data: { buffer: Array<Float32Array>, blob: Blob }): void {
        const { buffer } = data;

        this.setState({ isProcessing: true });

        const joinedBuffers = this.float32Concat(
            this.state.soundBuffer,
            buffer[0]
        );

        if (this._encoder) {
            this._encoder.postMessage({
                cmd: "encode",
                buf: joinedBuffers,
            });
        }
    }

    analyseAudio(volumeLevel: number): void {
        let newData = this.state.analysedAudio;

        newData.splice(
            Math.floor(Math.random() * this.state.analysedAudio.length),
            1,
            volumeLevel
        );

        this.setState({
            analysedAudio: newData,
        });
    }

    startRecording(): void {
        if (this._mediaRecorder && !this.state.isRecording && !this.state.isMessagePlaying) {
            this.setState({
                isRecording: true,
                soundBuffer: this._soundMeter.buffer,
            });

            if (this._encoder) {
                this._encoder.postMessage({
                    cmd: "init",
                    config: {
                        samplerate: 44100,
                        bps: 16,
                        channels: 1,
                        compression: 5,
                    },
                });
            }

            this._mediaRecorder.start();
        }
    }

    stopRecording(): void {
        if (this._mediaRecorder && this._encoder && this.state.isRecording) {
            this._mediaRecorder.stop().then(data => {
                this.setState({ isRecording: false });
                this.handleAudioCaptureFinished(data);
            });
        }
    }

    handleAudioSource(err: Error): void {
        if (err) {
            console.error("There was an error.", err);
            return;
        }

        this._volumeInterval = setInterval(() => {
            if (this._soundMeter) {
                const instantLevel = Math.round(this._soundMeter.instant * 100) / 100;
                const slowLevel = Math.round(this._soundMeter.slow * 100) / 100;

                this.setState({
                    instantLevel,
                    slowLevel,
                });

                this.analyseAudio(instantLevel);

                if (slowLevel >= this._audioCaptureThreshold) {
                    this.startRecording();
                }
                if (slowLevel < this._audioCaptureThreshold) {
                    this.stopRecording();
                }
            }
        }, 200);
    }

    quickReplyTriggered(action): void {
        this.sendTextIntent(action);
    }

    sendTextIntent(textIntent): void {
        if (this._websocket) {
            this.setState({
                isProcessing: true,
            });

            this._websocket.send(JSON.stringify({
                message: textIntent,
            }));
        }
    }

    onMessageAnnounceStart(): void {
        this.setState({
            isMessagePlaying: true,
        });
    }

    onMessageAnnounceEnd(): void {
        setTimeout(() => {
            this.setState({
                isMessagePlaying: false,
            });
        }, 550);
    }

    renderMessages(): React.Element<any> {
        return this.state.messages.map((message, iter) => {
            return (
                <React.Fragment key={iter}>
                    <ChatMessage
                        message={message}
                        showQuickRepliesIfAvailable={iter + 1 === this.state.messages.length && !this.state.isProcessing}
                        quickReplyCallback={this.quickReplyTriggered.bind(this)}
                        onMessageAnnounceStart={this.onMessageAnnounceStart.bind(this)}
                        onMessageAnnounceEnd={this.onMessageAnnounceEnd.bind(this)}
                    />
                </React.Fragment>
            );
        });
    }

    render(): React.Element<any> {
        return (
            <StaticPage
                title="Chat to Izzy"
                bannerName="chat static"
                className="ChatPage"
                bannerTitle="I'm Izzy, ask me anything!"
                bannerSubtitle="Our chat is private and anonymous."
            >
                <div className="MessageContainer">
                    {
                        this.state.showErrorMessage && (
                            <div>
                                It looks like we're having trouble accessing your microphone.
                                Please double check you allowed permission and try again.
                            </div>
                        )
                    }
                    {
                        !this._websocket || (
                            this._websocket.readyState === 0 && (
                                <ChatMessage
                                    message={{
                                        message_type: "to",
                                        fulfillment_messages: {
                                            texts: [
                                                "Connecting to server...",
                                            ],
                                        },
                                    }}
                                />
                            )
                        )
                    }
                    {this.renderMessages()}
                    {
                        this.state.showWebsocketReconnect && (
                            <ChatMessage
                                message={{
                                    message_type: "to",
                                    fulfillment_messages: {
                                        texts: [
                                            "You've been disconnected. Click here to reconnect.",
                                        ],
                                    },
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
                <DebugContainer message="Text Intents">
                    <DebugChatMessages onMessageSubmit={this.sendTextIntent.bind(this)} />
                </DebugContainer>
                {
                    this.state.showTalkButton ? (
                        <div
                            className="TalkButton"
                            onClick={this.startVoiceChat.bind(this)}
                        >
                            Talk
                        </div>
                    ) : (
                        <ChatInputVolumeDisplay audioData={this.state.analysedAudio} />
                    )
                }
            </StaticPage>
        );
    }
}
