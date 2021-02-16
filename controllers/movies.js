const Movie = require('../models/movie');

// возвращает все сохраненные фильмы
module.exports.getMovies = (req, res) => Movie.find({})
  .populate(['owner', 'movieId'])
  .then((movie) => res.send(movie))
  .catch((err) => {
    if (err.message === 'RequestError') {
      res.status(400).send({ message: 'Некорректные данные' });
    }
  });

// создаёт карточку фильма
module.exports.createMovie = (req, res) => {
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
    movieId: req.user._id, // временное значение, пока не подключились к стороннему сервису
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка добавления фильма' });
      }
    });
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
        .then(() => res.status(200).send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.message === 'AbsError') {
        return res.status(404).send({ message: 'Фильм с таким id не найден' });
      }
      if (err.message === 'ForbiddenError') {
        return res.status(403).send({ message: 'Нет прав на удаление' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};
