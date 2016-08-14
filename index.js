'use strict';
const Glue = require('glue');
const manifest = require('./config/manifest.json');
const mongojs = require('mongojs');


var options = {
  relativeTo: __dirname + '/lib/modules',
  preRegister: function (server, next) {
    server.app.db = mongojs('beerstore');
    next();
  }
};


Glue.compose(manifest, options, (err, server) => {
    if (err) {
        throw err;
    }

    server.start(function () {
        console.log('Server (hapi v%s)running at: %s', server.version, server.info.uri);
    });


    // change with a nice view with docs afterwards!!!
    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply('{"Hello fucking world!"}');
      }
    });

});
