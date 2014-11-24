module.exports = {
  server: {
    httpPort: 9000,
    httpsPort: 9443,
    appPort: 9080,
    livereloadPort: false,
    staticFolders: ['tmp', 'dist']
  },
  proxies: [
    {
      target: 'https://www.dev-charter.net',
      headers: {
        'X-Original-URL': 'https://dev-charter.net',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      },
      matcher: function(req, callback) {
        var apiMatch = /^\/api\//i.test(req.url);
        var setCallFeatureMatch = /shouldMock/i.test(req.url);
        if(!apiMatch) {
          return callback(false);
        } else if(setCallFeatureMatch){
          return callback(false);
        } else {
          return callback(true);
        }
      }
    },
    {
      target: 'http://www.dev-charter.net',
      headers: {
        'X-Original-URL': 'https://dev-charter.net'
//        'Accept': 'application/json'
      },
      matcher: function(req, callback) {

        return callback(/remote\.www\.dev-charter\.net/i.test(req.headers.host));
      }
    },
    {
      target: 'http://localhost:9080',
      matcher: function(req, callback) {
        return callback(true);
      }
    }
  ]
};
