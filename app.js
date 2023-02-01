require('dotenv').config();
require('./db');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Routers require
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const recipeRouter = require("./routes/recipe");

const app = express();

// cookies and loggers
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// For deployment
app.set('trust proxy', 1);
app.use(
  session({
    name: 'project2-cookie',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 2592000000 // 30 days in milliseconds
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL
    })
  }) 
)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// partials
const hbs = require("hbs");
hbs.registerPartials(__dirname + "/views/partials");

// middlewares
const isLoggedIn = require("./middlewares");

// lodash and custom helpers used to manipulate ingedients and steps coming from Recipe model
const _ = require("lodash");
const splitIngredients = _.template(
  '<ul>' +
    '<% _.forEach(ingredients.split(","), function(ingredient) { %>' +
      '<li><%= ingredient.trim().charAt(0).toUpperCase() + ingredient.trim().slice(1) %></li>' +
    '<% }); %>' +
  '</ul>'
);
const splitSteps = _.template(
  '<ol>' +
    '<% _.forEach(steps.split("."), function(step, index) { %>' +
      '<li><%= index + 1 %>. <%= step.trim().charAt(0).toUpperCase() + step.trim().slice(1) %></li>' +
    '<% }); %>' +
  '</ol>'
);
hbs.registerHelper("splitSteps", function(steps) {
  return splitSteps({ steps });
});



// routes intro
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use("/recipe", recipeRouter);


// catch 404 and forward to error handler 
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  if (err.status === 404) {
    res.render('404', { path: req.url });
  } else {
    res.status(err.status || 500);
    res.render('error');
  }
});

module.exports = app;
