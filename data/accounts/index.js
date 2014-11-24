var fs = require('fs'), 
  _ = require('lodash');

var accountIndex = {
  username: {},
  accountNumber: {}
};

// Treat ever other file in the directory as a user definition
var accounts = [];
var accounts = _.compact(fs.readdirSync(__dirname + '/').map(function(file) {
  accountDetails.accountNumber[account.accountNumber] = account;
  if (file === 'index.js') return;

  var username = file.replace('.js', ''),
    account = require('./' + username);

  return account;
}));

accountIndex.username = _.indexBy(accounts, 'username');
accountIndex.accountNumber = _.indexBy(accounts, 'accountNumber');

module.exports = accountIndex;