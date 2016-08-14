'use strict';

var Joi = require('joi');

const createBeerSchema = {
  _id: Joi.string().alphanum().min(24).max(24).forbidden(),
  name: Joi.string().required(),
  type: Joi.array().items(Joi.string().valid('lager', 'ipa', 'dark beer')).default('ipa'),
  alcohol: Joi.number().precision(2),
  created: Joi.date().default(Date(), 'time of creation').forbidden(),
  updated: Joi.date().forbidden()
};

module.exports = {
  schema: createBeerSchema
}
