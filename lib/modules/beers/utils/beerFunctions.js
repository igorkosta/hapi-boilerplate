'use strict';

const Boom = require('boom');

function verifyUniqueUser(request, reply) {
  // Find an entry from the database that
  // matches either the email

  const db = request.server.app.db;
  const users = db.collection('users');

  users.findOne({
    email: request.payload.email
  }, (err, user) => {
    if (user) {
      // if (user.email === request.payload.email) {
        return reply(Boom.badRequest('Email taken'));
      // }
    }

    reply(request.payload);
  });
}

function verifyCredentials(request, reply) {
  const db = request.server.app.db;
  const users = db.collection('users');

  const password = request.payload.password;

  // Find an entry from the database that
  // matches either the email or username
  users.findOne({
    email: request.payload.email
  }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (isValid) {
          reply(user);
        }
        else {
          return reply(Boom.badRequest('Incorrect password!'));
        }
      });
    } else {
      return reply(Boom.badRequest('Incorrect username or email!'));
    }
  });
}

module.exports = {
  verifyUniqueUser: verifyUniqueUser,
  verifyCredentials: verifyCredentials
}
