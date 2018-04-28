const express = require('express');

const { User } = require('../models/user');
const { auth } = require('../../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(users);
  });
});

router.get('/auth', auth, (req, res) => {
  res.json({
    isAuth: true,
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
  });
});

router.get('/logout', auth, (req, res) => {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({
      success: true,
      user,
    });
  });
});

router.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) {
      return res.json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      user: doc,
    });
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) return res.json({ isAuth: false, message: 'Auth fail, email not found' });
    user.comparePassword(req.body.password, (error, isMatch) => {
      if (!isMatch) return res.json({ isAuth: false, message: 'Wrong password' });
      user.generateToken((e, u) => {
        if (e) return res.status(400).send(e);
        res.cookie('auth', user.token).json({
          isAuth: true,
          id: u._id,
          email: u.email,
        });
      });
    });
  });
});

module.exports = router;
