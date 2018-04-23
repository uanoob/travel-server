const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  githubId: {
    type: String,
    required: true,
  },
  facebookId: {
    type: String,
    required: true,
  },
  twitterId: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
