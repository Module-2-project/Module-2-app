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
  try {
    const userDB = await User.findById(user._id);
    if (!username || !firstName || !lastName || !email || !cookingLevel) {
      res.render('profile/editProfile', {error: 'Please fill all data to sign up.', user: userDB});
      return;
    };
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.render("profile/editProfile", {error: "Please enter a valid email.", user: userDB});
      return;
    };
    const updatedUser = await User.findByIdAndUpdate(user._id, {username, firstName, lastName, email, cookingLevel}, {new: true});
    req.session.currentUser = updatedUser;
    res.redirect("/profile");
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
});

// @desc    Shows another user's profile page
// @route   GET /profile/:userId
// @access  User
router.get("/:userId", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const {userId} = req.params;
  try {
    const otherUser = await User.findById(userId);
    const recipes = await Recipe.find({owner: otherUser._id});
    const promises = recipes.map(async recipe => {
      const favoriteCount = await Favorite.countDocuments({favRecipe: recipe._id});
      return {...recipe.toObject(), favoriteCount};
    });
    const recipesWithFavorites = await Promise.all(promises);
    // toString used because otherwise the validation will work even though they are the same values
    if (otherUser._id.toString() === user._id.toString()) {
      res.redirect("/recipe/my-recipes");
    } else {
      res.render("profile/otherUser", {user: otherUser, recipe: recipesWithFavorites});
    }
  } catch(error) {
    next(error);
  }
});

module.exports = router;