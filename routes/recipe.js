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
  if (lactose) query.lactose = lactose === "true" ? true : false;
  if (gluten) query.gluten = gluten === "true";
  if (meat) query.meat = meat === "true" ? true : false;
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
    res.render("recipe/searchResults", {recipe: recipes, user});
  } catch (error) {
    next(error);
  }
});

// @desc    Displays a random recipe in preview mode
// @route   GET /recipe/random
// @access  Public
router.get("/random", async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const count = await Recipe.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomRecipe = await Recipe.findOne().skip(randomIndex);
    res.render("recipe/randomRecipe", {recipe: randomRecipe, user});
  } catch(error) {
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
  const { name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps, owner } = req.body;
  const user = req.session.currentUser;
  // regex to make sure the inRecipe.find(query)gredients and steps strings start by a letter
  if (!/^[a-zA-Z].*/.test(ingredients) || !/^[a-zA-Z].*/.test(steps)) {
    return next(new Error("You need to add ingredients separated by commas and steps separated by dots."));
  }
  try {
    const newRecipe = await Recipe.create({ name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps, owner });
    res.render("recipe/justAddedRecipe", {recipe: newRecipe, user });
    console.log(newRecipe);
  } catch(error) {
    next(error);
  }
});

// @desc    My recipes page
// @route   GET /recipe/my-recipes
// @access  User
router.get("/my-recipes", isLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  console.log(user);
  try {
    const recipes = await Recipe.find({ owner: user._id });
    res.render("recipe/myRecipes", { recipe: recipes, user });
  } catch(error) {
    next(error);
  }
});

// @desc    Displays recipe detail
// @route   GET /recipe/:recipeId/detail
// @access  User
router.get("/:recipeId", isLoggedIn, async (req, res, next) => {
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
router.get("/edit/:recipeId", isLoggedIn, async (req, res, next) => {
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
router.post("/edit/:recipeId", isLoggedIn, async (req, res, next) => {
  const { recipeId } = req.params;
  const user = req.session.currentUser;
  const { name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps, owner } = req.body;
  // regex to make sure the ingredients and steps strings start by a letter
  if (!/^[a-zA-Z].*/.test(ingredients) || !/^[a-zA-Z].*/.test(steps)) {
    return next(new Error("You need to add ingredients separated by commas and steps separated by dots."));
  }
  try {
    const editedRecipe = await Recipe.findByIdAndUpdate(recipeId, {name, image, time, cuisine, kcal, spices, lactose, gluten, meat, level, pax, ingredients, steps, owner}, {new: true});
    res.render("recipe/recipeDetail", {recipe: editedRecipe, user });
  } catch(error) {
    next(error);
  }
});

module.exports = router;