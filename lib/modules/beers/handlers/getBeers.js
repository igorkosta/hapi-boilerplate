'use strict';

const Boom = require('boom');

module.exports = function(request, reply) {

  const db = request.server.app.db;
  const beers = db.collection('beers');

  beers.find().sort({created: 1}, function(err, doc) {

    if (err) {
      return reply(Boom.badData('Intenal MongoDB error', err));
    }
    reply(doc);
  })
}
