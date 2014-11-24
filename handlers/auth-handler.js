var accounts = require('../data/accounts');

var authHandler = {
  login:function (req, res) {

    // handle get OR post request params
    var username, password;
    if (req.body && req.body.username && req.body.password) {
      username = req.body.username;
      password = req.body.password;
    }
    else {
      username = req.query.username;
      password = req.query.password;
    }

    console.log('Authenticating username=%s, password=%s', username, password);  
    
    var account = accounts.username[username];
    if (account && account.password === password) {
      res.json({status: true});  
    }
    else {
      res.sendStatus(401);
    }
  }
};


module.exports = authHandler;
