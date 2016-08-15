'use strict';

const Boom = require('boom');
const mongojs = require('mongojs');

module.exports =  function(request, reply) {

  const db = request.server.app.db;
  const beers = db.collection('beers');

  // update - updated attribute
  request.payload.updated = Date();

  beers.update({
    _id: mongojs.ObjectId(request.params.id)
  }, {
    $set: request.payload
  }, function(err, result) {

    if (err) {
      return reply(Boom.badData('Internal MongoDB error', err));
    }

    if (result.n === 0) {
      return reply(Boom.notFound());
    }
    reply().code(204);
  });
}
