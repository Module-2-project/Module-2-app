const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;


// @desc    Displays form view to sign up
// @route   GET /auth/signup
// @access  Public

//get signup view
router.get('/signup', async (req, res, next) => {
  res.render('auth/signup');
  console.log("signup!")
})

//post signup
router.post('/signup', async (req, res, next) => {
  const { username, firstName , lastName, email, password, cookingLevel } = req.body;
  if (!username || !firstName || !lastName || !email || !password || !cookingLevel) {
    res.render('auth/signup', { error: 'Please fill all data to signup' });
    return;
  } 
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.render("auth/signup", { error: "Password needs to contain at least 6 characters, one number and one lowercase and uppercase character."});
    return;
  }
//Check if user exists ... its correct?
  const userInDB = await User.findOne({ email: email });
  if (userInDB) {
    res.render('auth/signup' , { error: `${email} already exists!`});
    return;
  }
  
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await User.create({ username, firstName , lastName, email, hashedPassword, cookingLevel });
    res.redirect('/');
//redirect to Profile once the signup its done
  } catch (error) { 
    next (error);
  }
});


// @desc    Sends user auth data to database to create a new user
// @route   POST /auth/signup
// @access  Public
router.post('/signup', async (req, res, next) => {
  const { email, password, username } = req.body;
  // ⚠️ Add validations!
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ username, email, hashedPassword });
    res.render('auth/profile', user)
  } catch (error) {
    next(error)
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
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("auth/login", { error: "Introduce all the fields requested in order to log in"});
    return;
  }
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.render('auth/login', { error: `There is no user signed up for the following email: ${email}` });
      return;
    } else {
      const match = await bcrypt.compare(password, user.hashedPassword);
      if (match) {
        req.session.currentUser = user;
        res.redirect('/', user);
      } else {
        res.render('auth/login', { error: "Unable to authenticate user." });
      }
    }
  } catch (error) {
    next(error);
  }
});

// @desc    Destroy user session and log out
// @route   POST /auth/logout
// @access  Private 
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.redirect('/auth/login')
    }
  });
})

module.exports = router;