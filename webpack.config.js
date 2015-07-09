module.exports = {
    entry: "./src/entry.js",
    output: {
        path: __dirname,
        filename: "dist/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            }, {
                test: /\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['babel-loader']
            }, {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['babel-loader']
            }
        ]
    }
};
