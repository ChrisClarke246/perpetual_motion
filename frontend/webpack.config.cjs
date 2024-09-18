const path = require('path');

module.exports = {
  entry: './game/src/main/main.js',  // Entry point for your game
  output: {
    filename: 'bundle.js',  // Output file
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  mode: 'development',  // Set to 'production' for production build
};
