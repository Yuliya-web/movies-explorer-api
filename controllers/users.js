const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserError = require('../errors/UserError');
const AbsError = require('../errors/AbsError');

// возвращает информацию о текущем пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new AbsError('Такой пользователь отсутствует в базе'))
    .then((userData) => res.status(200).send(userData))
    .catch(next);
};

// обновляет профиль
const updateUser = (req, res) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true })
    .orFail(new Error('AbsError'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'AbsError') {
        res.status(404).send({ message: 'Такой пользователь отсутствует в базе' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
    });
};

// создает пользователя
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error('ExistEmailError');
      }
      return bcrypt.hash(password, 8)
        .then((hash) => User.create({
          name,
          email,
          password: hash,
        }))
        .then((data) => res.status(200).send({ email: data.email }))
        .catch(next);
    })
    .catch((err) => {
      if (err.message === 'ExistEmailError') {
        res.status(409).send({ message: 'Такой пользователь уже есть в базе' });
      }
      return res.status(200).send({ message: 'Вы успешно зарегистрировались' });
    });
};

// получение и проверка почты и пароля
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        return next(new UserError('Такого пользователя не существует'));
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new UserError('Неправильный логин или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUserInfo,
  createUser,
  login,
  updateUser,
};
