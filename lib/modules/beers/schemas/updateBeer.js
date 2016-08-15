'use strict';

var Joi = require('joi');

const updateBeerSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
};

module.exports = {
  schema: updateBeerSchema
}
