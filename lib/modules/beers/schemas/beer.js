'use strict';

var Joi = require('joi');

const userSchema = {
  _id: Joi.string().alphanum().min(24).max(24).forbidden(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
  created: Joi.date().default(Date(), 'time of creation').forbidden(),
  updated: Joi.date().forbidden()
};

module.exports = {
  schema: userSchema
}
