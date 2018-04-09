const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');

const keys = require('./config/keys');
const cors = require('./middleware/cors');

require('./models/user');
require('./models/tour');
require('./services/facebookStrategy');
require('./services/googleStrategy');
require('./services/twitterStrategy');
require('./services/githubStrategy');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey],
}));

app.use(cors);

app.use(passport.initialize());
app.use(passport.session());
// http://localhost:5000/images/boat.jpg
app.use(express.static(path.resolve(__dirname, 'public')));

require('./routes/facebook')(app);
require('./routes/google')(app);
require('./routes/twitter')(app);
require('./routes/github')(app);
require('./routes/logout')(app);
require('./routes/users')(app);
require('./routes/tours')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
