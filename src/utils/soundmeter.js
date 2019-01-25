export default class SoundMeter {
    constructor(context) {
        this.context = context;
        this.instant = 0.0;
        this.slow = 0.0;
        this.clip = 0.0;
        // We want to keep a 1 second buffer
        this.buffer = new Float32Array(this.context.sampleRate * 1);
        this.script = context.createScriptProcessor(2048, 1, 1);
        const that = this;

        this.script.onaudioprocess = function(event) {
            const input = event.inputBuffer.getChannelData(0);
            let pointer;
            let sum = 0.0;
            let clipcount = 0;

            for (pointer = 0; pointer < input.length; ++pointer) {
                sum += input[pointer] ** 2;
                if (Math.abs(input[pointer]) > 0.99) {
                    clipcount += 1;
                }
            }
            that.instant = Math.sqrt(sum / input.length);
            that.slow = 0.95 * that.slow + 0.05 * that.instant;
            that.clip = clipcount / input.length;

            let rollingBuffer = new Float32Array(that.buffer.length);

            rollingBuffer.set(that.buffer.slice(2048))
            rollingBuffer.set(input, that.buffer.length - 2048);
            that.buffer = rollingBuffer;
        };
    }

    connectToSource(stream, callback) {
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

    stop() {
        this.mic.disconnect();
        this.script.disconnect();
    }
}
