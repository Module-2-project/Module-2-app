const express = require('express');
const router = express.Router();
const User = require('../models/User');
const isLoggedIn = require('../middlewares');
const Recipe = require ('../models/Recipe');

// @desc    Shows profile page
// @route   GET /profile
// @access  User
router.get('/', isLoggedIn,  async (req,res,next) => {
  const user = req.session.currentUser;
  try {
    const userDB = await User.findOne({_id: user._id})
    res.render("profile/profile", {user: userDB});
  } catch(error) {
    next(error);
  }
});

// @desc    Shows profile edit page
// @route   GET /profile/edit
// @access  User
router.get("/edit", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const userDB = await User.findOne({_id: user._id});
    console.log(userDB);
    res.render("profile/editProfile", {user: userDB});
  } catch(error) {
    next(error);
  }
});

// @desc    Send new data to profile
// @route   POST /profile/edit
// @access  User
router.post("/edit", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const {username, firstName, lastName, email, cookingLevel} = req.body;
  if (!username || !firstName || !lastName || !email || !cookingLevel) {
    res.render('profile/editProfile', {error: 'Please fill all data to sign up.', user});
    return;
  }
  try {
    const editedProfile = await User.findByIdAndUpdate(user._id, {username, firstName, lastName, email, cookingLevel}, {new: true});
    res.render("profile/profile", {user: editedProfile});
  } catch(error) {
    next(error);
  }
});

// @desc    Delete profile
// @route   POST /profile/delete
// @access  User
router.get("/delete", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    await User.findByIdAndDelete(user._id);
    res.redirect("/auth/signup");
  } catch(error) {
    next(error);
  }
})

module.exports = router;