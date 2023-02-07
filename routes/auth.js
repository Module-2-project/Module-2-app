const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const Recipe = require("../models/Recipe");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const isLoggedIn = require('../middlewares/index');

// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public
router.get('/signup', async (req, res, next) => {
  res.render('auth/signup');
})


// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public
router.post('/signup', async (req, res, next) => {
  const {username, firstName , lastName, email, password, cookingLevel} = req.body;
  if (!username || !firstName || !lastName || !email || !password || !cookingLevel) {
    res.render('auth/signup', {error: 'Please fill all data to sign up.'});
    return;
  } 
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.render("auth/signup", {error: "Password needs to contain at least 6 characters, one number, one special character and one lowercase and uppercase character."});
    return;
  }
  const userInDB = await User.findOne({email});
  if (userInDB) {
    res.render('auth/signup', {error: `${email} already exists!`});
    return;
  }
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await User.create({username, firstName, lastName, email, hashedPassword, cookingLevel});
    res.redirect('/auth/login');
  } catch (error) { 
    next (error);
  }
});

// @desc    Displays form view to log in
// @route   GET /auth/login
// @access  Public
router.get('/login', async (req, res, next) => {
  res.render('auth/login');
})

// @desc    Sends user auth data to database to authenticate user
// @route   POST /auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  const {email, password} = req.body;
  if (!email || !password) {
    res.render("auth/login", {error: "Introduce all the fields requested in order to log in"});
    return;
  }
  try {
    const user = await User.findOne({email});
    if (!user) {
      res.render('auth/login', {error: `There is no user signed up for the following email: ${email}`});
      return;
    } else {
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (match) {
        req.session.currentUser = user;
        const recipes = await Recipe.find();
        res.render('index', {user, recipe: recipes});
      } else {
        res.render('auth/login', {error: "Unable to authenticate user."});
      }
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Shows reset password page
// @route   GET /auth/password-reset
// @access  User
router.get("/password-reset", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const userDB = await User.findOne({_id: user._id});
    res.render("auth/passwordReset", {user: userDB});
  } catch(error) {
    next(error);
  }
});

// @desc    Resets password 
// @route   POST /auth/password-reset
// @access  User
router.post("/password-reset", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const {oldPassword, newPassword, confirmPassword} = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    res.render("auth/passwordReset", {error: "You need to fill the 3 fields in order to reset your password"});
    return;
  }
  const match = await bcrypt.compare(oldPassword, user.hashedPassword);
  if (!match) {
    res.render("auth/passwordReset", {error: "Old password isn't correct."});
    return;
  };
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(newPassword)) {
    res.render("auth/passwordReset", {error: "Password needs to contain at least 6 characters, one number, one special character and one lowercase and uppercase character."});
    return;
  }
  if (newPassword !== confirmPassword) {
    res.render("auth/passwordReset", {error: "You need to confirm your password by re-writing the same password as the new desired one."});
    return;
  }
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    const userDB = await User.findByIdAndUpdate({_id: user._id}, {hashedPassword});
    req.session.currentUser = userDB;
    res.redirect('/auth/login');
  } catch(error) {
    next(error);
  }
});

// @desc    Destroy user session and log out
// @route   POST /auth/logout
// @access  User 
router.get('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.redirect('/auth/login')
    }
  });
})

module.exports = router;