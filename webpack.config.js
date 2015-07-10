module.exports = {
    entry: "./src/client.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                exclude: /(node_modules)/,
                loader: "style!css"
            }, {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                loaders: ['babel-loader']
            }, {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loaders: ['babel-loader']
            }
        ]
    }
};
