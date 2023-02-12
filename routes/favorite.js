const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const User = require('../models/User');
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite");
const {isLoggedIn} = require('../middlewares');

// @desc    Shows favorites
// @route   GET /favorites
// @access  User
router.get("/", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const favorites = await Favorite.find({favOwner: user._id});
    const favIds = favorites.map(favorite => favorite.favRecipe);
    const recipePromises = [];
    for (let i=0; i<favIds.length; i++) {
      recipePromises.push(Recipe.findById(favIds[i]));
    }
    const recipes = await Promise.all(recipePromises);
    const promises = recipes.map(async recipe => {
      const favoriteCount = await Favorite.countDocuments({favRecipe: recipe._id});
      return {...recipe.toObject(), favoriteCount};
    });
    const recipesWithFavorites = await Promise.all(promises);
    res.render("favorite/myFavorites", {user, recipe: recipesWithFavorites});
  } catch (error) {
    next(error);
  }
});


// @desc    Adds recipe to favorites
// @route   GET /favorites/add/:recipeId
// @access  User
router.get("/add/:recipeId", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const {recipeId} = req.params;
  try {
    await Favorite.create({favRecipe: recipeId, favOwner: user._id});
    res.redirect("back");
  } catch(error) {
    next(error);
  }
});

// @desc    Removes recipe from favorites
// @route   GET /favorites/delete/:recipeId
// @access  User
router.get("/delete/:recipeId", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const {recipeId} = req.params;
  try {
    await Favorite.deleteOne({favRecipe: recipeId, favOwner: user._id});
    res.redirect("back");
  } catch(error) {
    next(error);
  }
});

module.exports = router;