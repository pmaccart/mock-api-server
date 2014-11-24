var fs = require('fs'), 
  _ = require('lodash');

// Treat ever other file in the directory as a user definition
var accounts = [];
var accounts = _.compact(fs.readdirSync(__dirname + '/').map(function(file) {
  if (file === 'index.js') return;

  var username = file.replace('.js', ''),
    account = require('./' + username);

  return account;
}));

var accountIndex = {
  username: _.indexBy(accounts, 'username'),
  accountNumber: _.indexBy(accounts, 'accountNumber')
};

module.exports = accountIndex;