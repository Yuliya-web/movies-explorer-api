const Movie = require('../models/movie');
const RequestError = require('../errors/RequestError');
const {
  forbiddenText,
  serverErrText,
  movieIdErrorText,
  deletedMovie,
  validationErrorText,
} = require('../constants/constants');

// возвращает все сохраненные фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(new RequestError(validationErrorText))
    .then((movies) => res.send(movies))
    .catch(next);
};

// создаёт карточку фильма
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
    movieId,
  })
    .then((movie) => {
      if (!movie) {
        throw new RequestError(validationErrorText);
      }
      res.send(movie);
    })
    .catch((err) => next(err));
};

// удаляет фильм по идентификатору
module.exports.deleteMovie = (req, res) => {
  Movie.findById(req.params._id)
    .orFail(new Error('AbsError'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new Error('ForbiddenError');
      }
      movie.remove()
        .then(() => res.status(200).send({ message: deletedMovie }));
    })
    .catch((err) => {
      if (err.message === 'AbsError') {
        return res.status(404).send({ message: movieIdErrorText });
      }
      if (err.message === 'ForbiddenError') {
        return res.status(403).send({ message: forbiddenText });
      }
      return res.status(500).send({ message: serverErrText });
    });
};
