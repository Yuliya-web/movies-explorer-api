const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  updateUser, getUserInfo,
} = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.get('/me', getUserInfo);

userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateUser);

module.exports = userRoutes;
