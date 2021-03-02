/* @flow */

// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// Starts a webpack dev server for dev environments

import WebpackDevServer from "webpack-dev-server";
import webpack from "webpack";
import config from "./dev.config";

const WEBPACK_HOST = process.env.HOST || "0.0.0.0";
const WEBPACK_PORT = parseInt(process.env.PORT || "") + 1 || 3001;

const serverOptions = {
    contentBase: "./public/",
    inline: true,
    public: `http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
    publicPath: config.output.publicPath,
    ...{allowedHosts: process.env.ALLOWED_HOSTS && [process.env.ALLOWED_HOSTS]},
};

const compiler = webpack(config);
const webpackDevServer = new WebpackDevServer(compiler, serverOptions);

webpackDevServer.listen(WEBPACK_PORT, WEBPACK_HOST, () => {
    console.info(`Webpack development server listening on ` +
                 `${WEBPACK_HOST}:${WEBPACK_PORT}`);
});
