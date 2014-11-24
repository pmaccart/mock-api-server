var express = require('express'),
  authHandler = require('./handlers/auth-handler');

module.exports = function (app, config) {
  // Authentication API
  app.post('/login/index.php', authHandler.login);
  app.get('/login/index.php', authHandler.login);
};
