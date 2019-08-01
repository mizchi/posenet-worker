const HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  plugins: [new HTMLWebpackPlugin()]
};
