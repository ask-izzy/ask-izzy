// App config the for development environment.
// Do not require this directly. Use ./src/config instead.

export default {
    issUrl: (function() {
        if (process.env.ISS_URL) {
            return process.env.ISS_URL;
        } else {
            throw new Error("Must set ISS_URL");
        }
    }()),
};
