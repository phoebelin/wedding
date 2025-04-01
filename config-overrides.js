module.exports = function override(config, env) {
  // Change the output path to 'docs' instead of 'build'
  config.output.path = require('path').resolve(__dirname, 'docs');
  return config;
}; 