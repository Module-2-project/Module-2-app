const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const User = require('../models/User');
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite");
const isLoggedIn = require('../middlewares');

// @desc    Shows favorites
// @route   GET /favorites
// @access  User
router.get("/", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const userDB = await User.findById(user._id);
    const favorites = await Favorite.find({favOwner: userDB._id}).populate("Recipe");
    res.render("favorite/myFavorites", {recipe: favorites, user: userDB});
  } catch(error) {
    next(error);
  }
});

// @desc    Adds recipe to favorites
// @route   POST /favorites/add/:recipeId
// @access  User
router.post("/add/:recipeId", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const {recipeId} = req.params;
  try {
    const userDB = await User.findById(user._id);
    await Favorite.create({favRecipe: recipeId, favOwner: userDB._id});
    res.redirect(`/recipe/${recipeId}`);
  } catch(error) {
    next(error);
  }
});

// @desc    Removes recipe from favorites
// @route   POST /favorites/delete/:recipeId
// @access  User
router.post("/delete/:recipeId", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const {recipeId} = req.params;
  try {
    const userDB = await User.findById(user._id);
    await Favorite.deleteOne({favRecipe: recipeId, favOwner: userDB._id});
    res.redirect(`/recipe/${recipeId}`);
  } catch(error) {
    next(error);
  }
});

module.exports = router;