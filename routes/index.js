const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const moviesRoutes = require('./movies');
const userRoutes = require('./users');
const auth = require('../middlewares/auth');

const AbsError = require('../errors/AbsError');
const {
  notFoundErrorText,
} = require('../constants/constants');

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().max(30).min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

routes.use('/users', auth, userRoutes);
routes.use('/movies', auth, moviesRoutes);

routes.use('/*', () => {
  throw new AbsError(notFoundErrorText);
});

module.exports = routes;
