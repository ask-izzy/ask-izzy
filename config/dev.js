// App config the for development environment.
// Do not require this directly. Use ./src/config instead.

export default {
    iss: (function() {
        if (process.env.ISS_URL) {
            return {
                url: process.env.ISS_URL,
                username: process.env.ISS_API_USER,
                password: process.env.ISS_API_PASS,
                digest: process.env.ISS_AUTHORIZATION,
            }
        } else {
            throw new Error("Must set ISS_URL");
        }
    }()),
};
