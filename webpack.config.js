const path = require("path");
const webpack = require("webpack")

module.exports = {
    entry: "./code/index.tsx",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "./bundle.js"
    },
    devServer: {
        port: 8080,
        contentBase: "./public"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        alias: {
            modules: path.resolve(__dirname, "/node_modules")
        }
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    }
}