var authHandler = {
  login:function (req, res) {
    res.send(200, {status: true});
  }
};


module.exports = authHandler;
