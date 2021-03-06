'use strict';

const Joi = require('joi');
const Boom = require('boom');
const beer = require('./schemas/beer');
const createBeer = require('./schemas/createBeer');
const verifyUniqueBeer = require('./utils/beerFunctions').verifyUniqueBeer;

exports.register = function (server, options, next) {

  const db =  server.app.db;
  const beers = db.collection('beer');

  const beerSchema = beer.schema;
  const createBeerSchema = createBeer.schema;

  server.route({
    method: 'POST',
    path: '/beers',
    config: {
      pre: [
        { method: verifyUniqueBeer }
      ],
      handler: require('./handlers/createBeer.js'),
      validate: {
        payload: beerSchema,
        options: {
          abortEarly: false
        }
      },
      description: 'Create new beer',
      tags: ['api', 'beers']
    }
  });

  server.route({
    method: 'GET',
    path: '/beers',
    config: {
      handler: require('./handlers/getBeers'),
      description: 'Get list of all available beers',
      tags: ['api', 'beers']
    }
  });

  server.route({
    method: 'GET',
    path: '/beers/{id}',
    config: {
      handler: require('./handlers/getBeer'),
      validate: {
        params: {
          id: [Joi.string().alphanum().min(24).max(24)] // mongodb _id
        }
      },
      description: 'Obtain beer information',
      tags: ['api', 'beers']
    }
  });

  server.route({
    method: 'PATCH',
    path: '/beers/{id}',
    config: {
      handler: require('./handlers/updateBeer'),
      validate: {
        payload: beerSchema,
        options: {
          abortEarly: false
        }
      },
      description: 'Update an existing beer',
      tags: ['api', 'beers']
    }
  });

  server.route({
    method: 'DELETE',
    path: '/beers/{id}',
    config: {
      handler: require('./handlers/deleteBeer'),
      description: 'Delete an existing beer',
      tags: ['api', 'beers']
    }
  });

  next();

};

exports.register.attributes = {
  pkg: require('./package.json')
};
