'use strict';

const Boom = require('boom');

module.exports = function(request, reply) {

  const db = request.server.app.db;
  const beers = db.collection('beers');

  const beer = request.payload;

  beers.save(beer, (err, result) => {
    
    if (err) {
      return reply(Boom.badData('Internal MongoDB error', err));
    }

    reply(beer).code(201);
  });
}
