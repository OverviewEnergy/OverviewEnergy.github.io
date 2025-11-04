const config = require('./config');
const path = require('path');

module.exports = {
  mode: 'production',
  cache: true,
  entry: {
    roi: `${__dirname}/../js/roi`
  },
  output: {
    path: `${__dirname}/../../${config.outputPath}/${config.jsDirectory}`,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.*', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, '../js/'),
        use: 'babel-loader'
      }
    ]
  }
};
