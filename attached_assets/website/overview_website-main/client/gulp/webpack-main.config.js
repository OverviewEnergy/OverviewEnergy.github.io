const config = require('./config');
const path = require('path');

module.exports = {
  mode: 'development',
  cache: true,
  entry: {
    main: `${__dirname}/../js/main`
  },
  output: {
    path: `${__dirname}/../../${config.outputPath}/${config.jsDirectory}`,
    filename: '[name].js'
  },
  externals: ['$', 'jQuery'],
  resolve: {
    extensions: ['*', '.js'],
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
