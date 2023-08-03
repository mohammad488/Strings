const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  isDev,
  db: {
    uri: process.env.MONGO_URI,
    name: 'strings',
  },
};
