const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const User = require('../models/User');
const Recipe = require("../models/Recipe");
const { addListener } = require('../app');
const isLoggedIn = require('../middlewares');

// @desc    Displays search form for recipes
// @route   GET /recipe/search
// @access  Public
router.get("/search", (req, res, next) => {
  const user = req.session.currentUser;
  res.render("recipe/search", {user});
});

// @desc    Searches for recipes
// @route   GET /recipe/search
// @access  Public
router.get("/search-results", async (req, res, next) => {
  const user = req.session.currentUser;
  const { name, cuisine, spices, lactose, gluten, meat, level, pax } = req.query;
  // Define the query to search for and avoid error if blank field in search form
  let query = {};
  if (name) query.name = { $regex: `.*${name}.*`, $options: "i" };
  if (cuisine) query.cuisine = cuisine;
  if (spices) query.spices = spices;
  if (lactose) query.lactose = lactose === "Yes";
  if (gluten) query.gluten = gluten === "Yes";
  if (meat) query.meat = meat === "Yes";
  if (level) query.level = level;
  if (pax) query.pax = pax;
  try {
    const recipe = await Recipe.find(query);
    res.render("recipe/searchResults", {recipe, user});
  } catch (error) {
    next(error);
  }
});


// @desc    Displays all recipes in preview mode
// @route   GET /recipe/all
// @access  Public
router.get("/all", async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const recipes = await Recipe.find({});
    res.render("recipe/searchResults", {recipe: recipes, user: user});
  } catch (error) {
    next(error);
  }
});

// @desc    Displays add new recipe form
// @route   GET /recipe/new
// @access  User
router.get("/new", isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  res.render("recipe/newRecipe", {user});
});

// @desc    Sends new recipe form
// @route   POST /recipe/new
// @access  User
router.post("/new", isLoggedIn, async (req, res, next) => {
  const { name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps, username } = req.body;
  const user = req.session.currentUser;
  try {
    const newRecipe = await Recipe.create({ name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps, username }, {new: true});
    res.render("recipe/searchResults", {recipe: newRecipe, user: user});
  } catch(error) {
    next(error);
  }
});

// @desc    Displays recipe detail
// @route   GET /recipe/:recipeId/detail
// @access  User
router.get("/:recipeId/detail", isLoggedIn, async (req, res, next) => {
  const { recipeId } = req.params;
  const user = req.session.currentUser;
  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
  return next(new Error("Invalid recipe ID"));
  }
  try {
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe/recipeDetail", {recipe, user});
  } catch (error) {
    next(error);
  }
});

// @desc    Displays edit recipe form
// @route   GET /recipe/:recipeId/edit
// @access  User
router.get("/:recipeId/edit", isLoggedIn, async (req, res, next) => {
  const { recipeId } = req.params;
  const user = req.session.currentUser;
  try {
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe/editRecipe", {recipe, user});
  } catch(error) {
    next(error);
  }
});

// @desc    Sends edit recipe form data
// @route   POST /recipe/:recipeId/edit
// @access  User
router.post("/:recipeId/edit", isLoggedIn, async (req, res, next) => {
  const { recipeId } = req.params;
  const user = req.session.currentUser;
  const { name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps, username } = req.body;
  try {
    const editedRecipe = await Recipe.findByIdAndUpdate(recipeId, {name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps, username}, {new: true});
    res.render("recipe/searchResults", {recipe: editedRecipe, user: user});
  } catch(error) {
    next(error);
  }
});

module.exports = router;