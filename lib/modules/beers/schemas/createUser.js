'use strict';

var Joi = require('joi');

const createUserSchema = {
  _id: Joi.string().alphanum().min(24).max(24).forbidden(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
  scope: Joi.array().items(Joi.string().valid('user', 'admin')).default('user').forbidden(),
  created: Joi.date().default(Date(), 'time of creation').forbidden(),
  updated: Joi.date().forbidden()
};

module.exports = {
  schema: createUserSchema
}
