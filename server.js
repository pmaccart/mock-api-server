var express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  httpProxy = require('http-proxy'),
  _ = require('lodash'),
  config = require('./config');

var proxies = _.map(config.proxies, function (proxyConfig) {
  var proxy = httpProxy.createProxyServer({
    target: proxyConfig.target,
    secure: proxyConfig.secure || false,
    header: proxyConfig.headers || null
  });

  proxy.on('error', function() {
    console.log('Proxy error occurred', arguments);
  });

  proxy._matcher = proxyConfig.matcher;
  proxy._target = proxyConfig.target;
  return proxy;
});

var router = function (req, res) {
  // var proxy = _.find(proxies, function (proxy) {
  //   return proxy._matcher(req);
  // });
  //
  // if (proxy) {
  //   console.log('Proxying request for host=%s, path=%s to %s', req.headers.host, req.url, proxy._target);
  //   return proxy.web(req, res);
  // }
  // else {
  //   return res.send(404);
  // }

  var i = 0;
  function next() {
    var proxy = proxies[i++];
    if (proxy) {
      proxy._matcher(req, function(match) {
        if (match) {
          return proxy.web(req, res);
        }
        else {
          setTimeout(next, 1);
        }
      });
    } else {
      return res.send(404);
    }
  }
  next();
}

// Only listen for HTTPS if a port is defined
var httpsPort = process.env.HTTPS_PORT || config.server.httpsPort || false;
if (httpsPort) {
  https.createServer({
    key: fs.readFileSync('./keys/development.key'),
    cert: fs.readFileSync('./keys/development.crt')
  }, router).listen(httpsPort, function() {
    console.log('Listening for HTTPS connections on port %s', httpsPort);
  });
}

// Always listen for HTTP connections
var httpPort = process.env.PORT || config.server.httpPort || 9000;
http.createServer(router).listen(httpPort, function() {
  console.log('Listening for HTTP connections on port %s', httpPort);
});


var app = express();
app.use(bodyParser.urlencoded())
app.use(bodyParser.json());
app.use(cookieParser());

//if (config.server.livereloadPort) {
//  console.log('Using livereload');
//  app.use(require('connect-livereload')({
//    port: 9088,
//    key: fs.readFileSync('./server/keys/development.key'),
//    cert: fs.readFileSync('./server/keys/development.crt')
//
//  }));
//}

// Static Resources
console.log('Using dirname: %s', __dirname);
config.server.staticFolders.forEach(function(path) {
  var fullPath = __dirname + '/../' + path;
  console.log('Mounting static folder at: %s', fullPath);
  app.use(express.static(fullPath));
//  app.use(express.static(path));
});

require('./routes')(app, config);
app.listen(config.server.appPort);

module.exports = app;
