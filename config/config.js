const {
  NODE_ENV,
  JWT_SECRET,
  MONGO_URL,
  PORT = 3000,
} = process.env;

const mongooseParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

module.exports = {
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
  MONGO_URL: NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb',
  PORT,
  mongooseParams,
};
