module.exports = function(grunt) {

  var proxy = require('http-proxy-middleware');

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // workaround for http-proxy with gzip chunked server responses
  // found here: https://github.com/nodejitsu/node-http-proxy/issues/1007
  function handleGzip(proxyRes, req, res) {
    var gzipped = /gzip/.test(proxyRes.headers["content-encoding"]);
    if(gzipped) {
      res.write = (function(override) {
        return function(chunk, encoding, callback) {
          override.call(res, chunk, "binary", callback);
        };
      })(res.write);
      res.end = (function(override) {
        return function(chunk, encoding, callback) {
          override.call(res, chunk, "binary", callback);
        };
      })(res.end);
    }
  }

  function prx(path, target) {
    return proxy(path, {
      target: typeof target !== 'undefined' ? target : 'http://qldarch.net',
      changeOrigin: true,
      prependPath: true,
      logLevel: 'info',
      onProxyRes: function(proxyRes, req, res) {
        handleGzip(proxyRes, req, res);
      }
    });
  }

  grunt.config('connect', {
    options: {
      port: 9000,
      // Change this to '0.0.0.0' to access the server from outside.
      hostname: 'localhost',
      livereload: 35729,
      middleware: function(connect, options, middlewares) {
        // inject a custom middleware into the array of default middlewares
        middlewares.unshift(prx('/ws', 'http://qldarch-test.metadata.net/qldarch'), prx('/files'), prx('/omeka'), prx('/static'), prx('/solr'));
        return middlewares;
      }
    },
    livereload: {
      options: {
        open: false,
        base: 'app'
      }
    }
  });
  grunt.config('watch', {
    options: {
      livereload: true,
    },
    web: {
      files: 'app/**'
    }
  });

  grunt.registerTask('server', function(target) {
    grunt.task.run([
      'copy:timeline',
      'connect:livereload',
      'watch'
    ]);
  });

};
