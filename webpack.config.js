const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: 'eval-source-map',
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RSS Reader',
      template: './src/template.html',
    }),
  ],
};
