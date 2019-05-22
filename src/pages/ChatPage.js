/* flow:disable */
/* eslint-disable max-len */

import * as React from "react";
import Recorder from "recorder-js";

import StaticPage from "./StaticPage";
import ChatMessage from "../components/ChatMessage";
import DebugContainer from "../components/DebugContainer";
import DebugChatMessages from "../components/DebugChatMessages";
import AudioFile from "../components/AudioFile";
import ChatButton from "../components/styled/ChatButton";
import ChatButtonContainer from "../components/styled/ChatButtonContainer";

import SoundMeter from "../utils/soundmeter";
import ChatInputVolumeDisplay from "../components/ChatInputVolumeDisplay";

import storage from "../storage";

type State = {
    analysedAudio: Array<number>,
    instantLevel: number,
    isMessagePlaying: boolean,
    isMuted: boolean,
    isProcessing: boolean,
    isRecording: boolean,
    lastError: ?string,
    messages: Array<Object>,
    showErrorMessage: boolean,
    showTalkButton: boolean,
    showWebsocketReconnect: boolean,
    slowLevel: number,
    soundBuffer: Float32Array,
}

export const Context = React.createContext();

export type ContextType = {
    setProcessing: Function,
    websocket: WebSocket,
};

export default class ChatPage extends React.Component<{}, State> {
    _websocket: ?WebSocket;
    _volumeInterval: ?IntervalID;
    _audioContext: ?AudioContext;
    _soundMeter: ?SoundMeter;
    _mediaRecorder: ?Recorder;
    _encoder: ?Worker;

    _audioCaptureThreshold: number = 0.05;
    _audioFiles = [];
    _websocketUrl: ?URL;

    state = {
        analysedAudio: (new Array(5)).fill(0),
        instantLevel: 0,
        isBlurred: false,
        isMessagePlaying: false,
        isMuted: false,
        isProcessing: false,
        isRecording: false,
        lastError: null,
        messages: [],
        showErrorMessage: false,
        showTalkButton: true,
        showWebsocketReconnect: false,
        slowLevel: 0,
        soundBuffer: new Float32Array(),
    };

    constructor(props: {}): void {
        super(props)

        if (typeof window !== "undefined") {
            this._websocketUrl = new URL(window.SPEECH_SERVER_URL);
        }
    }

    componentDidMount(): void {
        this.connectWebsocket();
        window.addEventListener("blur", this.onBlurTab);
        window.addEventListener("focus", this.onFocusTab);
    }

    async componentWillUnmount(): Promise<void> {
        window.removeEventListener("blur", this.onBlurTab);
        window.removeEventListener("focus", this.onFocusTab);
        await this.cancelRecording();
        if (this._websocket) {
            this._websocket.close();
        }
    }

    onBlurTab = (): void => {
        this.setState({
            isMuted: true,
            isBlurred: true,
        });
    }

    onFocusTab = (): void => {
        if (this.state.isBlurred) {
            this.setState({
                isMuted: false,
                isBlurred: false,
            });
        }
    }

    /**
     * Connect to the websocket server.
     */
    connectWebsocket = (): void => {
        if (!this._websocket || this._websocket.readyState > 1) {
            this._websocket = new WebSocket(this._websocketUrl.href);

            this._websocket.onopen = () => {
                this._websocket.send(JSON.stringify({
                    cmd: "authenticate",
                    data: {
                        credentials: btoa(`${this._websocketUrl.username}:${this._websocketUrl.password}`),
                    },
                }));
                this._websocket.send(JSON.stringify({
                    cmd: "set_context",
                    data: storage.getAllItems(),
                }));
                this.setState({ showWebsocketReconnect: false });
            };

            this._websocket.onmessage = (frame: {data: mixed}): void => {
                const data = JSON.parse(frame.data);

                if (!data.success) {
                    this.setState({
                        lastError: data.message,
                        isProcessing: false,
                        showErrorMessage: true,
                    });

                    return
                }

                this.setState({
                    messages: [...this.state.messages, data],
                    isProcessing: false,
                });
            };

            this._websocket.onclose = (err): void => {
                if (err.code !== 1000) {
                    this.setState({
                        showWebsocketReconnect: true,
                        isProcessing: false,
                    });
                    console.error("Chat socket closed unexpectedly.", err);
                }
                this._websocket = undefined;
            };
        }
    }

    /**
     * Request permission from the user and start a voice session.
     */
    startVoiceChat = async(): void => {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this._audioContext = new AudioContext();
        } catch (err) {
            console.error("Web Audio API not supported.");
        }

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });

                this.handleSuccess(stream);
            } catch (error) {
                this.handleError(error);
            }
        } else {
            this.setState({
                showErrorMessage: true,
                lastError: `It looks like your browser currently doesn't support
                voice submission, please try switching browsers in order to use this feature.`,
                showWebsocketReconnect: false,
            });
            if (this._websocket) {
                this._websocket.close();
            }
        }

    }

    /**
     * Handle an error occurring while attempting to gain permission to a
     * user's audio input.
     */
    handleError = (error): void => {
        console.log("navigator.getUserMedia error: ", JSON.stringify(error));
        this.setState({
            showErrorMessage: true,
            showTalkButton: true,
            lastError: null,
        });
    }

    /**
     * Handle successfully gaining permission to the user's audio input stream.
     */
    handleSuccess = (stream): void => {
        this.setState({ showTalkButton: false });

        console.log("Media Recorder starting");
        this._mediaRecorder = new Recorder(this._audioContext, {
            nFrequencyBars: 3,
            microphoneConfig: {
                numChannels: 1,
            },
        });
        this._mediaRecorder.init(stream);
        this._mediaRecorder.inputPoint.gain.value = 5.0;

        this._soundMeter = new SoundMeter(this._audioContext);
        this._soundMeter.connectToSource(
            stream,
            this.handleAudioSource
        );

        this._encoder = new Worker("/static/scripts/encoder.js");
        this._encoder.onmessage = (msg): void => {
            if (msg.data.cmd === "end") {
                const blob = msg.data.buf;
                const reader = new FileReader();

                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    const base64 = reader.result.split(",")[1];

                    if (this._websocket) {
                        this._websocket.send(JSON.stringify({
                            cmd: "audio",
                            data: base64,
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
        };
    }

    /**
     * Concatenate two Float32Arrays.
     */
    float32Concat(first: Float32Array, second: Float32Array): Float32Array {
        const firstLength = first.length;
        let result = new Float32Array(firstLength + second.length);

        result.set(first);
        result.set(second, firstLength);

        return result;
    }

    /**
     * Process a section of audio and have it encoded.
     */
    handleAudioCaptureFinished = (data: { buffer: Array<Float32Array>, blob: Blob }): void => {
        const { isMuted } = this.state;
        const { buffer } = data;

        if (!isMuted) {
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
    }

    /**
     * Analyse the last section of recorded audio and save to state.
     * This is used for the input volume indicator.
     */
    analyseAudio(volumeLevel: number): void {
        const { isMuted } = this.state;
        let newData = this.state.analysedAudio;

        if (isMuted) {
            volumeLevel = 0;
        }

        newData.splice(
            Math.floor(Math.random() * this.state.analysedAudio.length),
            1,
            volumeLevel
        );

        this.setState({
            analysedAudio: newData,
        });
    }

    /**
     * Starts recording and configures the service worker required for encoding
     * the audio.
     */
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

    /**
     * Stops a recording and processes the recorded data.
     */
    async stopRecording(): void {
        if (this._mediaRecorder && this._encoder && this.state.isRecording) {
            try {
                const data = await this._mediaRecorder.stop();

                this.setState({ isRecording: false });
                this.handleAudioCaptureFinished(data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    /**
     * Cancel audio recording.
     */
    cancelRecording = async(): void => {
        if (this._volumeInterval) {
            clearInterval(this._volumeInterval);
        }
        if (this._soundMeter) {
            this._soundMeter.stop();
        }
        if (this._mediaRecorder && this.state.isRecording) {
            await this._mediaRecorder.stop();
        }
        if (this._audioContext) {
            await this._audioContext.close();
        }

        this.setState({ showTalkButton: true });
    }

    /**
     * Take the audio source and watch input volume to trigger recording.
     */
    handleAudioSource = (err: Error): void => {
        if (err) {
            console.error("There was an error.", err);
            return;
        }

        this._volumeInterval = setInterval(() => {
            if (this._soundMeter) {
                const { isMuted } = this.state;

                const instantLevel = Math.round(this._soundMeter.instant * 100) / 100;
                const slowLevel = Math.round(this._soundMeter.slow * 100) / 100;

                this.setState({
                    instantLevel,
                    slowLevel,
                });

                this.analyseAudio(instantLevel);

                if (slowLevel >= this._audioCaptureThreshold && !isMuted) {
                    this.startRecording();
                }
                if (slowLevel < this._audioCaptureThreshold) {
                    this.stopRecording();
                }
            }
        }, 200);
    }

    /**
     * Toggle the audio input mute status.
     */
    toggleAudioInputMute = (): void => {
        this.setState({ isMuted: !this.state.isMuted });
    }

    /**
     * Called when a quick reply has been clicked.
     */
    quickReplyTriggered = (action): void => {
        this.sendTextIntent(action);
    }

    /**
     * Send a text message to the server.
     */
    sendTextIntent = (textIntent): void => {
        if (this._websocket) {
            this.setState({
                isProcessing: true,
            });

            this._websocket.send(JSON.stringify({
                cmd: "text",
                data: textIntent,
            }));
        }
    }

    /**
     * Called when automatic voice messages start playing.
     */
    onMessageAnnounceStart = (): void => {
        this.setState({
            isMessagePlaying: true,
        });
    }

    /**
     * This is called when automatic voice messages from chat are finished
     * speaking.
     */
    onMessageAnnounceEnd = (): void => {
        setTimeout(() => {
            this.setState({
                isMessagePlaying: false,
            });
        }, 550);
    }

    renderMessages(): React.Element<any> {
        return this.state.messages.map((message, iter) => {
            return (
                <Context.Provider
                    value={{
                        websocket: this._websocket,
                        setProcessing: () => {
                            this.setState({
                                isProcessing: true,
                            })
                        },
                    }}
                >
                    <React.Fragment key={`message${iter}`}>
                        <ChatMessage
                            message={message}
                            showQuickRepliesIfAvailable={iter + 1 === this.state.messages.length && !this.state.isProcessing}
                            quickReplyCallback={this.quickReplyTriggered}
                            onMessageAnnounceStart={this.onMessageAnnounceStart}
                            onMessageAnnounceEnd={this.onMessageAnnounceEnd}
                        />
                    </React.Fragment>
                </Context.Provider>
            );
        });
    }

    render(): React.Element<any> {
        const {
            analysedAudio,
            isMuted,
            isProcessing,
            lastError,
            showErrorMessage,
            showTalkButton,
            showWebsocketReconnect,
        } = this.state;

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
                        showErrorMessage && (
                            <div>
                                {
                                    lastError ? (
                                        `${lastError}`
                                    ) : (
                                        `It looks like we're having trouble ` +
                                        `accessing your microphone. Please ` +
                                        `double check you allowed permission ` +
                                        `and try again.`
                                    )
                                }
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
                        showWebsocketReconnect && (
                            <ChatMessage
                                message={{
                                    message_type: "to",
                                    fulfillment_messages: {
                                        texts: [
                                            "You've been disconnected.",
                                        ],
                                        "quick_replies": [
                                            "Reconnect",
                                        ],
                                    },
                                }}
                                showQuickRepliesIfAvailable={true}
                                quickReplyCallback={this.connectWebsocket}
                            />
                        )
                    }
                </div>
                {
                    isProcessing && (
                        <div className="lds-dual-ring" />
                    )
                }
                <DebugContainer message="Text Intents">
                    <DebugChatMessages onMessageSubmit={this.sendTextIntent} />
                </DebugContainer>
                {
                    showTalkButton ? (
                        <ChatButtonContainer>
                            <ChatButton onClick={this.startVoiceChat}>
                                Talk
                            </ChatButton>
                        </ChatButtonContainer>
                    ) : (
                        <React.Fragment>
                            <ChatInputVolumeDisplay audioData={analysedAudio} />
                            <ChatButtonContainer>
                                <ChatButton onClick={this.cancelRecording}>
                                    Cancel
                                </ChatButton>
                                <ChatButton onClick={this.toggleAudioInputMute}>
                                    {
                                        isMuted ? "Unmute" : "Mute"
                                    }
                                </ChatButton>
                            </ChatButtonContainer>
                        </React.Fragment>
                    )
                }
            </StaticPage>
        );
    }
}
