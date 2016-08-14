'use strict';

var Joi = require('joi');

const authenticateUserSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
};

module.exports = {
  schema: authenticateUserSchema
}
