const express = require ('express');
const logger = require ('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require ('express-session');
const passport = require('passport');

//initial the app & set up dotenv //
const app = express();
require('dotenv').config();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use (
  session({
    key: process.env.SECRET_KEY,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('SEE YOU IN SUCCESS!')
});

app.get('/', (req, res) => {
  res.send("Hello Mofongo!");
});

const authRoutes =  require('./routes/auth-routes');
app.use('/api/auth', authRoutes);
const movieRoutes = require('./routes/movie-routes');
app.use('/api/movies', movieRoutes);

//add error handlers //
app.use('*', (req, res) => {
  res.status(400).json({
    message:  'Not found!',
  });
});

app.use((err, req, res, next) =>{
  console.log(err);
  res.status(500).json({
    error: err,
    message: err.message,
  });
});
