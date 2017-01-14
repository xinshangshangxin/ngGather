'use strict';

require('./config/globalInit');

var appStart = require('./config/bootstrap')()
  .then(function() {
    return new Promise(function(resolve, reject) {
      var bodyParser = require('body-parser');
      var cookieParser = require('cookie-parser');
      var express = require('express');
      var http = require('http');
      var morgan = require('morgan');
      var path = require('path');
      var cors = require('cors');
      var wrapError = require('./policies/wrapError.js');
      var routersConfig = require('./routes/routes.config');

      var app = express();

      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'ejs');
      app.engine('.html', require('ejs').__express);

      app.use(morgan('dev'));
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({
        extended: false
      }));
      app.use(cookieParser());
      app.use(express.static(path.join(__dirname, 'public')));

      app.use('/', wrapError);
      app.use('/', cors());

      routersConfig.forEach(function (routerConfig) {
        if(!routerConfig.disabled) {
          app.use('/', require(routerConfig.path));
        }
      });

      // 404
      app.use(function(req, res) {
        var err = new Error('Not Found: ' + req.url);
        logger.warn(err);
        err.status = 404;
        res.status(404);
        res.end();
      });


      // err
      app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.json({
          err: err
        });
      });

      var port = config.env.port || '1337';
      var ip = config.env.ip;
      var server = http.createServer(app);
      server.listen(port, ip);
      server.on('error', onError);
      server.on('listening', onListening);

      function onError(error) {
        reject(error);
        if(error.syscall !== 'listen') {
          logger.error(error);
          return;
        }

        var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch(error.code) {
          case 'EACCES':
            logger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
          case 'EADDRINUSE':
            logger.error(bind + ' is already in use');
            process.exit(1);
            break;
          default:
            logger.error(error);
            process.exit(1);
        }
      }

      /**
       * Event listener for HTTP server "listening" event.
       */
      function onListening() {
        var addr = server.address();

        if(addr.address === '::') {
          logger.info('addr.address === ::');
          addr.address = '127.0.0.1';
        }

        var bind = typeof addr === 'string' ? 'pipe ' + addr : ('http://' + addr.address + ':' + addr.port);
        logger.info('Listening on: ' + bind);
        resolve(app);
      }
    });
  });


module.exports = appStart;
