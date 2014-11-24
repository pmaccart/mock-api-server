var _ = require('lodash');

var env = process.env.NODE_ENV || 'development';

console.log('Loading configurations for %s environment.', env);
var config = _.extend(require('./env/' + env), {});

module.exports = config;