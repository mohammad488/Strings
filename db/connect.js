const { connect } = require('mongoose');
const { isDev, db } = require('../config');

module.exports = async () => {
  try {
    const uri = db.uri;
    await connect(uri);

    console.log('database connected');
  } catch (error0) {
    console.log(error0.message);
  }
};
