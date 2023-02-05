const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const User = require('../models/User');
const Recipe = require("../models/Recipe");
const Review = require("../models/Review");
const isLoggedIn = require('../middlewares');

// @desc    Displays add review form
// @route   GET /review/new
// @access  User
router.get("/new/:recipeId", isLoggedIn, async (req, res, next) => {
  const { recipeId } = req.params;
  const user = req.session.currentUser;
  try {
    const recipe = await Recipe.findOne({recipeId});
    const userDB = await User.findOne({_id: user._id});
    res.render("review/addReview", {user: userDB, recipe: recipe });
  } catch(error) {
    next(error);
  }
});

// @desc    Sends review
// @route   POST /review/new
// @access  User
router.post("/new/:recipeId", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const { title, comment, stars, reviewerName } = req.body;
  const { recipeId } = req.params;
  try {
    const review = await Review.create({ title, comment, stars, reviewerName, reviewer: user._id, recipeRated: recipeId });
    // render my reviews page once created
  } catch(error) {
    next(error)
;  }
});

module.exports = router;