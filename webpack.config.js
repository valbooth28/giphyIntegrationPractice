const path = require("path");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "GiphyToolTipDemo.html"
  },
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: ".(js|css)$" // embed all javascript and css inline
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],
  devServer: {
    writeToDisk: filePath => {
      return filePath.includes("html");
    }
  }
};
