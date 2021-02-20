const jwt = require('jsonwebtoken');
const UserError = require('../errors/UserError');
const {
  authErrorText,
} = require('../constants/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UserError(authErrorText);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UserError(authErrorText);
  }
  req.user = payload;

  next();
};
