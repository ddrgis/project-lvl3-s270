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
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                // TODO: add postcss.config.js
                return [require('precss'), require('autoprefixer')]; // eslint-disable-line 
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  devtool: 'eval-source-map',
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RSS Reader',
      template: './src/template.html'
    })
  ]
};
