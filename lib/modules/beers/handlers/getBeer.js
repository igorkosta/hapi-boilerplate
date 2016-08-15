'use strict';

const Boom = require('boom');
const mongojs = require('mongojs');

module.exports = function(request, reply) {

  const db = request.server.app.db;
  const beers = db.collection('beers');

  beers.findOne({
    _id: mongojs.ObjectId(request.params.id)
  }, function(err, doc) {

    if (err) {
      return reply(Boom.badData('Internal MongoDB error', err));
    }

    if (!doc) {
      return reply(Boom.notFound());
    }

    reply(doc);
  })
}
