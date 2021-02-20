const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserError = require('../errors/UserError');
const AbsError = require('../errors/AbsError');
const ExistEmailError = require('../errors/ExistEmailError');
const {
  userNotFoundText,
  existUserText,
  loginErrorText,
} = require('../constants/constants');

// возвращает информацию о текущем пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new AbsError(userNotFoundText))
    .then((userData) => res.status(200).send(userData))
    .catch(next);
};

// обновляет профиль
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true })
    .orFail(new AbsError(userNotFoundText))
    .then((user) => res.send(user))
    .catch(next);
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
        throw new ExistEmailError(existUserText);
      }
      return bcrypt.hash(password, 8)
        .then((hash) => User.create({
          name,
          email,
          password: hash,
        }))
        .then((data) => res.status(200).send({ email: data.email }));
    })
    .catch(next);
};

// получение и проверка почты и пароля
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        return next(new UserError(userNotFoundText));
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new UserError(loginErrorText));
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
