/* @flow */
/* eslint-disable max-len */


/* This code is adapted from
https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/volume/js/soundmeter.js
and so must retain the below license:

Copyright(c) 2014, The WebRTC project authors.All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

    *
    Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.

    *Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in
    the documentation and / or other materials provided with the
distribution.

    *Neither the name of Google nor the names of its contributors may
be used to endorse or promote products derived from this software
without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
    "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED.IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES(INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
*/

export default class SoundMeter {
    _sampleLength: number = 2048;
    context: AudioContext;
    instant: number = 0.0;
    slow: number = 0.0;
    buffer: Float32Array;
    script: ScriptProcessorNode;
    mic: MediaStreamAudioSourceNode;

    constructor(context: AudioContext): void {
        this.context = context;
        // We want to keep a 1 second buffer
        this.buffer = new Float32Array(this.context.sampleRate * 1);
        this.script = context.createScriptProcessor(this._sampleLength, 1, 1);

        this.script.onaudioprocess = (event: $FlowIssue): void => {
            const input = event.inputBuffer.getChannelData(0);
            const sum = input.reduce((carry, cur) => carry + (cur ** 2), 0.0);

            this.instant = Math.sqrt(sum / input.length);
            this.slow = 0.95 * this.slow + 0.05 * this.instant;

            let rollingBuffer = new Float32Array(this.buffer.length);

            rollingBuffer.set(this.buffer.slice(this._sampleLength))
            rollingBuffer.set(input, this.buffer.length - this._sampleLength);
            this.buffer = rollingBuffer;
        };
    }

    connectToSource(stream: MediaStream, callback: Function): void {
        console.log("SoundMeter connecting");
        try {
            this.mic = this.context.createMediaStreamSource(stream);
            this.mic.connect(this.script);
            // necessary to make sample run, but should not be.
            this.script.connect(this.context.destination);
            if (typeof callback !== "undefined") {
                callback(null);
            }
        } catch (err) {
            console.error(err);
            if (typeof callback !== "undefined") {
                callback(err);
            }
        }
    }

    stop(): void {
        this.mic.disconnect();
        this.script.disconnect();
    }
}
