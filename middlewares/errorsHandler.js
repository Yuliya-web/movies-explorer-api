const {
  serverErrText,
} = require('../constants/constants');

// eslint-disable-next-line no-unused-vars
function errorsHandler(err, req, res, next) {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? serverErrText
      : message,
  });
}

module.exports = errorsHandler;
