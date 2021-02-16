const jwt = require('jsonwebtoken');
const UserError = require('../errors/UserError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UserError('Нужна авторизация!!');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UserError('Нужна авторизация!');
  }
  req.user = payload;

  next();
};
