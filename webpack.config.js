const HTMLWebpackPlugin = require("html-webpack-plugin");
const WorkerLoader = require("worker-plugin");

module.exports = {
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: "ts-loader"
      }
    ]
  },
  plugins: [new HTMLWebpackPlugin(), new WorkerLoader()]
};
