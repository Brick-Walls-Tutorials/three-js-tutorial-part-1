const path = require("path");

module.exports = {
  // 1
  entry: path.resolve(__dirname, "./main.js"),
  // 2
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
  },
  // 3
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },
  // 4
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
  },
};
