const keys = require('../config/keys');

module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', keys.allowCrossDomain);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};
