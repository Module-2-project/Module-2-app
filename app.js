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
const reviewRouter = require("./routes/review");
const profileRouter = require('./routes/profile');

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
const isLoggedIn = require("./middlewares/index");

// lodash and custom helpers used to manipulate ingedients and steps coming from Recipe model
const _ = require("lodash");
const { profile } = require('console');
// ingredients will show as an unordered list, all with capital letter
const splitIngredients = _.template(
  '<ul>' +
    '<% _.forEach(ingredients.split(","), function(ingredient) { %>' +
      '<li><%= ingredient.trim().charAt(0).toUpperCase() + ingredient.trim().slice(1) %></li>' +
    '<% }); %>' +
  '</ul>'
);
// steps will show as an ordered list, all with capital letter at first letter of each step
const splitSteps = _.template(
  '<ol>' +
    '<% _.forEach(steps.split("."), function(step, index) { %>' +
      '<% if (index !== steps.split(".").length - 1 || step.trim().length > 0) { %>' +
        '<li><%= step.trim().charAt(0).toUpperCase() + step.trim().slice(1) %></li>' +
      '<% } %>' +
    '<% }); %>' +
  '</ol>'
);
hbs.registerHelper("splitIngredients", function(ingredients) {
  return splitIngredients({ ingredients });
});
hbs.registerHelper("splitSteps", function(steps) {
  return splitSteps({ steps });
});
// helper to compare values from DB to another value
hbs.registerHelper('eq', function (value, otherValue, options) {
  if (_.isEqual(value, otherValue)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

// routes intro
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/recipe', recipeRouter);
app.use('/review', reviewRouter);
app.use('/profile', profileRouter);


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
