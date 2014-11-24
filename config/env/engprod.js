module.exports = {
  server: {
    httpPort: 9000,
    httpsPort: 9443,
    appPort: 9080,
    livereloadPort: 35729,
    staticFolders: ['tmp', 'dist']
  },
  proxies: [
    {
      target: 'http://www.engprod-charter.net',
      headers: {
        'X-Original-URL': 'https://engprod-charter.net',
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
      target: 'http://www.engprod-charter.net',
      headers: {
        'X-Original-URL': 'https://engprod-charter.net'
//        'Accept': 'application/json'
      },
      matcher: function(req, callback) {

        return callback(/remote\.www\.engprod-charter\.net/i.test(req.headers.host));
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
