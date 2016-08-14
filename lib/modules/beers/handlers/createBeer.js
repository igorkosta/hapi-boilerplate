'use strict';

const Boom = require('boom');
const bcrypt = require('bcrypt');
const createToken = require('./utils/token');


function hashPassword(password, cb) {
  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash);
    });
  });
}

module.exports = function(request, reply) {

  const db = request.server.app.db;
  const users = db.collection('users');

  const user = request.payload;

  // TODO: only authenticated admins can create admin users
  // user.scopes = ['admin'];

  hashPassword(user.password, (err, hash) => {
    if (err) {
      throw Boom.badRequest(err);
    }
    user.password = hash;

    users.save(user, (err, result) => {
      if (err) {
        return reply(Boom.badData('Internal MongoDB error', err));
      }

      // don't include password and scope in the reply
      user.password = undefined;
      reply({
        user: user,
        jwt: createToken(user)
      }).code(201);
    });
  });
}
