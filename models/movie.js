const mongoose = require('mongoose');

const urlValidation = new RegExp('^(https?:\\/\\/)?(www\\.)?'
    + '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}' // домен
    + '(\\/[a-z0-9#$:!@[]();&%_.~+=-?]*)*', 'i'); // путь

// Опишем схему:
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return urlValidation.test(v);
      },
      message: 'Некорректный URL',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return urlValidation.test(v);
      },
      message: 'Некорректный URL',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return urlValidation.test(v);
      },
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: { // id фильма, который содержится в ответе сервиса MoviesExplorer
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movie',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', movieSchema);
