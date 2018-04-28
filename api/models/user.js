const mongoose = require('mongoose');
const bcript = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_IT = 10;
const config = require('../../config');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  name: {
    type: String,
    maxLength: 100,
  },
  lastname: {
    type: String,
    maxLength: 100,
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
});

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcript.genSalt(SALT_IT, (err, salt) => {
      if (err) return next(err);
      bcript.hash(user.password, salt, (error, hash) => {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcript.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), config.jwtKey);
  user.token = token;
  user.save((err, u) => {
    if (err) return cb(err);
    cb(null, u);
  });
};

userSchema.methods.deleteToken = function (token, cb) {
  const user = this;
  user.update({ $unset: { token: 1 } }, (err, u) => {
    if (err) return cb(err);
    cb(null, u);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  const user = this;
  jwt.verify(token, config.jwtKey, (err, decode) => {
    user.findOne({ _id: decode, token }, (error, u) => {
      if (error) return cb(error);
      cb(null, u);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
