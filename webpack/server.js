// This file from https://github.com/gpbl/isomorphic500 @ 413c6533ae23

// Starts a webpack dev server for dev environments

import WebpackDevServer from "webpack-dev-server";
import webpack from "webpack";
import config from "./dev.config";
import debuglib from "debug";

const debug = debuglib("web");

const WEBPACK_HOST = process.env.HOST || "localhost";
const WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 3001;

const serverOptions = {
    contentBase: `http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
    quiet: true,
    noInfo: true,
    hot: true,
    publicPath: config.output.publicPath,
};

const compiler = webpack(config);
const webpackDevServer = new WebpackDevServer(compiler, serverOptions);

webpackDevServer.listen(WEBPACK_PORT, WEBPACK_HOST, () => {
    debug(
        "Webpack development server listening on %s:%s",
        WEBPACK_HOST,
        WEBPACK_PORT
    );
});
