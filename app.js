const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');

mongoose.connect(config.mongoURI);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
// http://localhost:5000/public/images/boat.jpg
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors());

require('./api/routes/tours')(app);
require('./api/routes/users')(app);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
