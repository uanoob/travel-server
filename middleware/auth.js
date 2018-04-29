const { User } = require('../api/models/user');

const auth = (req, res, next) => {
  console.log('req.cookies: ', req.cookies);
  const token = req.cookies.auth;
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        error: true,
      });
    }
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
