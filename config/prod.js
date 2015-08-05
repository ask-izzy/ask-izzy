// App config the for production environment.
// Do not require this directly. Use ./src/config instead.

export default {
    // Google Analytics tracking id (skipped on dev)
    trackingId: "",
    issUrl: process.env.ISS_URL,
};
