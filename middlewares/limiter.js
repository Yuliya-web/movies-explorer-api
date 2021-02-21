const rateLimit = require('express-rate-limit');
const { limiterText } = require('../constants/constants');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: limiterText },
});

module.exports = limiter;
