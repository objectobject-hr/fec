const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function servicePath(folder, index) {
  return path.join(__dirname, folder, 'client', 'src', index)
}

const services = {
  steven: servicePath('searchbar-service', 'index.jsx'),
  david: servicePath('David-service', 'index.jsx'),
  blake: servicePath('service-blake', 'index.js'),
  aaron: servicePath('service-aaron', 'index.jsx')
}

const dist = path.join(__dirname, 'proxy-blake', 'dist')

module.exports = {
  externals: {},
  plugins: [new HtmlWebpackPlugin({ template: 'proxy-blake/src/index.html' })],
  entry: { ...services },
  output: {
    filename: '[name].js',
    path: dist
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['transform-class-properties']
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}
