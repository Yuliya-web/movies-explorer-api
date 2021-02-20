const moviesRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createMovie, deleteMovie, getMovies,
} = require('../controllers/movies');

moviesRoutes.get('/', getMovies);

moviesRoutes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/https?:\/\/(w*\.)?[\d\w\-.[+()~:/\\?#\]@!$&'*,;=]{2,}#?/),
    trailer: Joi.string().required().regex(/https?:\/\/(w*\.)?[\d\w\-.[+()~:/\\?#\]@!$&'*,;=]{2,}#?/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(/https?:\/\/(w*\.)?[\d\w\-.[+()~:/\\?#\]@!$&'*,;=]{2,}#?/),
    movieId: Joi.number().required(),
  }),
  headers: Joi.object().keys({}).unknown(true),
}), createMovie);

moviesRoutes.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
  //  headers: Joi.object().keys({}).unknown(true),
}), deleteMovie);

module.exports = moviesRoutes;
