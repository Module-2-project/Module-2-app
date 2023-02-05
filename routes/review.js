const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const User = require('../models/User');
const Recipe = require("../models/Recipe");
const Review = require("../models/Review");
const isLoggedIn = require('../middlewares');

// @desc    Displays user reviews
// @route   GET /review/my-reviews
// @access  User
router.get("/my-reviews", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const userDB = await User.findOne({_id: user._id});
    const reviews = await Review.find({reviewer: user._id});
    const recipe = await Recipe.findOne({_id: reviews.recipeRated});
    res.render("review/myReviews", {review: reviews, user: userDB, recipe: recipe});
  } catch(error) {
    next(error);
  }
});

// @desc    Displays add review form
// @route   GET /review/new/:recipeid
// @access  User
router.get("/new/:recipeId", isLoggedIn, async (req, res, next) => {
  const {recipeId} = req.params;
  const user = req.session.currentUser;
  try {
    const recipe = await Recipe.findOne({_id: recipeId});
    console.log(recipe);
    const userDB = await User.findOne({_id: user._id});
    res.render("review/addReview", {user: userDB, recipe: recipe});
  } catch(error) {
    next(error);
  }
});

// @desc    Sends review
// @route   POST /review/new/:recipeId
// @access  User
router.post("/new/:recipeId", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const {title, comment, stars, reviewerName} = req.body;
  const {recipeId} = req.params;
  try {
    const userDB = await User.findOne({_id: user._id});
    const recipe = await Recipe.findOne({_id: recipeId});
    console.log(recipe);
    const review = await Review.create({title, comment, stars, reviewerName, reviewer: userDB._id, recipeRated: recipeId});
    res.render("recipe/recipeDetail", {recipe: recipe, review: review, user: userDB});
  } catch(error) {
    next(error)
;  }
});

module.exports = router;