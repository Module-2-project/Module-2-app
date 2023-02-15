const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const User = require('../models/User');
const Recipe = require("../models/Recipe");
const Review = require("../models/Review");
const {isLoggedIn} = require('../middlewares');
const {isAdmin} = require("../middlewares");

// @desc    Displays user reviews
// @route   GET /review/my-reviews
// @access  User
router.get("/my-reviews", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const reviews = await Review.find({reviewer: user._id});
    res.render("review/myReviews", {review: reviews, user});
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
    const allReviews = await Review.find({recipeRated: recipe._id});
    const reviewCheck = await Review.find({recipeRated: recipe._id, reviewer: user._id});
    // toString used because otherwise the validation will work even though they are the same values
    if (recipe.owner.toString() === user._id.toString()) {
      res.render("recipe/recipeDetail", {error: "You cannot rate your own recipe.", recipe, user, user});
    }
    // prevents user from sending multiple reviews for same recipe
    if (reviewCheck.length !== 0) {
      res.render("recipe/recipeDetail", {error: "You already rated this recipe.", review: allReviews, recipe, user});
    } else {
      res.render("review/addReview", {recipe, user});
    }
  } catch(error) {
    next(error);
  }
});

// @desc    Sends review
// @route   POST /review/new/:recipeId
// @access  User
router.post("/new/:recipeId", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  const {title, comment, stars, reviewerName, recipeName } = req.body;
  const {recipeId} = req.params;
  try {
    const recipe = await Recipe.findOne({_id: recipeId});
    await Review.create({title, comment, stars, reviewerName: user.username, reviewer: user._id, recipeName: recipe.name, recipeRated: recipeId});
    res.redirect(`/recipe/${recipeId}`);
  } catch(error) {
    next(error)
;  }
});

// @desc    Gets all reviews
// @route   GET /review/all
// @access  Admin
router.get("/all", isAdmin, async(req, res, next) => {
  const user = req.session.currentUser;
  try {
    const allReviews = await Review.find().populate("reviewer");;
    res.render("review/allReviews", {review: allReviews, user});
  } catch(error) {
    next(error);
  }
});

// @desc    Delete review
// @route   GET /review/delete/:reviewId
// @access  Admin
router.get("/delete/:reviewId", isAdmin, async(req, res, next) => {
  const user = req.session.currentUser;
  const {reviewId} = req.params;
  try {
    await Review.findByIdAndDelete(reviewId);
    res.redirect("/review/all");
  } catch(error) {
    next(error);
  }
});

module.exports = router;