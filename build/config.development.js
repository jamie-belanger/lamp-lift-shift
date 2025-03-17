const { merge } = require('webpack-merge');

module.exports = merge(require('./config.base.js'), {
  mode: 'development',
  watch: true
  
  // All webpack configuration for development environment will go here
  // We don't actually use this due to the nature of the current setup.
  // But it's here for future usage if needed.
});
