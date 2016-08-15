'use strict';

const Boom = require('boom');

function verifyUniqueBeer(request, reply) {

  const db = request.server.app.db;
  const beers = db.collection('beers');

  beers.findOne({
    name: request.payload.name
  }, (err, beer) => {
    if (beer) {
      // if (user.email === request.payload.email) {
        return reply(Boom.badRequest('Beer already on the shelf'));
      // }
    }

    reply(request.payload);
  });
}

module.exports = {
  verifyUniqueBeer: verifyUniqueBeer
}
