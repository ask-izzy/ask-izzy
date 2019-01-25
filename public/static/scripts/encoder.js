importScripts('libflac4-1.3.2.min.js');

var flac_encoder,
BUFSIZE = 4096,
CHANNELS = 1,
SAMPLERATE = 44100,
COMPRESSION = 5,
BPS = 16,
flac_ok = 1,
flacLength = 0,
flacBuffers = [],
wavLength = 0,
wavBuffers = [],
INIT = false;

function write_callback_fn(buffer, bytes) {
    flacBuffers.push(buffer);
    flacLength += buffer.byteLength;
}

self.onmessage = function(e) {
    switch (e.data.cmd) {
        case 'init':
            if (!e.data.config) {
                e.data.config = { bps: BPS, channels: CHANNELS, samplerate: SAMPLERATE, compression: COMPRESSION };
            }

            e.data.config.channels = e.data.config.channels ? e.data.config.channels : CHANNELS;
            e.data.config.samplerate = e.data.config.samplerate ? e.data.config.samplerate : SAMPLERATE;
            e.data.config.bps = e.data.config.bps ? e.data.config.bps : BPS;
            e.data.config.compression = e.data.config.compression ? e.data.config.compression : COMPRESSION;

            COMPRESSION = e.data.config.compression;
            BPS = e.data.config.bps;
            SAMPLERATE = e.data.config.samplerate;
            CHANNELS = e.data.config.channels;

            if (!Flac.isReady()) {
                Flac.onready = function() {
                    setTimeout(function() {
                        initFlac();
                    }, 0);
                }
            } else {
                initFlac();
            }
        break;

        case 'encode':
            encodeFlac(e.data.buf);
        // break;

        // case 'finish':
            var data;
            if (!Flac.isReady()) {
                console.error('Flac was not initialized: could not encode data!');
            } else {
                // flac_ok &= Flac.FLAC__stream_encoder_finish(flac_encoder);
                // console.log("flac finish: " + flac_ok);//DEBUG
                data = exportFlacFile(flacBuffers, flacLength, mergeBuffersUint8);

                clear();
                self.postMessage({cmd: 'end', buf: data});
                Flac.FLAC__stream_encoder_delete(flac_encoder);
                INIT = false;
            }

        break;
    }
};

//HELPER: handle initialization of flac encoder
function initFlac() {
    flac_encoder = Flac.init_libflac_encoder(SAMPLERATE, CHANNELS, BPS, COMPRESSION, 0);

    if (flac_encoder !== 0) {
        var status_encoder = Flac.init_encoder_stream(flac_encoder, write_callback_fn);
        flac_ok &= (status_encoder === 0);

        console.log("flac init     : " + flac_ok);//DEBUG
        console.log("status encoder: " + status_encoder);//DEBUG

        INIT = true;
    } else {
        console.error("Error initializing the encoder.");
    }
}

//HELPER: handle incoming PCM audio data for Flac encoding:
function encodeFlac(audioData) {
    if (!Flac.isReady()) {
        //if Flac is not ready yet: buffer the audio
        wavBuffers.push(audioData);
        console.info('buffered audio data for Flac encdoing')
    } else {
        if (wavBuffers.length > 0) {
            //if there is buffered audio: encode buffered first (and clear buffer)

            var len = wavBuffers.length;
            var buffered = wavBuffers.splice(0, len);
            for (var i=0; i < len; ++i) {
                doEncodeFlac(buffered[i]);
            }
        }

        doEncodeFlac(audioData);
    }
}

//HELPER: actually encode PCM data to Flac
function doEncodeFlac(audioData) {
    var buf_length = audioData.length;
    var buffer_i32 = new Uint32Array(buf_length);
    var view = new DataView(buffer_i32.buffer);
    var volume = 1;
    var index = 0;
    for (var i = 0; i < buf_length; i++){
        view.setInt32(index, (audioData[i] * (0x7FFF * volume)), true);
        index += 4;
    }

    var flac_return = Flac.FLAC__stream_encoder_process_interleaved(flac_encoder, buffer_i32, buffer_i32.length / CHANNELS);
    if (flac_return != true){
        console.log("Error: encode_buffer_pcm_as_flac returned false. " + flac_return);
    }
}

function exportFlacFile(recBuffers, recLength) {
    //convert buffers into one single buffer
    var samples = mergeBuffersUint8(recBuffers, recLength);

    var the_blob = new Blob([samples], { type: 'audio/flac' });
    return the_blob;
}

function writeUTFBytes(view, offset, string) {
    var lng = string.length;
    for (var i = 0; i < lng; ++i) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function mergeBuffersUint8(channelBuffer, recordingLength) {
    var result = new Uint8Array(recordingLength);
    var offset = 0;
    var lng = channelBuffer.length;
    for (var i = 0; i < lng; i++) {
        var buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
    }
    return result;
}

function float32ToUint8Array(float32Array) {
    var output = new Uint8Array(float32Array.length);

    for (var i = 0; i < float32Array.length; i++) {
        var tmp = Math.max(-1, Math.min(1, float32Array[i]));
        tmp = tmp < 0 ? (tmp * 0x8000) : (tmp * 0x7FFF);
        tmp = tmp / 256;
        output[i] = tmp + 128;
    }

    return output;
}

/*
 * clear recording buffers
 */
function clear() {
    flacBuffers.splice(0, flacBuffers.length);
    flacLength = 0;
    wavBuffers.splice(0, wavBuffers.length);
    wavLength = 0;
}
