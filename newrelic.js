/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
    app_name: [`Ask Izzy (${process.env.ENVIRONMENT})`],
    license_key: process.env.NEW_RELIC_KEY,
    proxy: process.env.HTTP_PROXY,
    logging: {
        level: 'info',
    },
};
