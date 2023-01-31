const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require("../models/Recipe");

// functions to manipulate ingredients and steps in Recipe model
function stringToBulletList(str) { 
  let array = str.split(","); 
  let list = "<ul>"; 
  for (let i = 0; i < array.length; i++) { 
    list += "<li>" + array[i] + "</li>"; 
  } 
  list += "</ul>"; 
  return list; 
} 
function stringToOrderedList(str) { 
  let array = str.split(","); 
  let list = "<ol>"; 
  for (let i = 0; i < array.length; i++) { 
    list += "<li>" + array[i] + "</li>"; 
  } 
  list += "</ol>"; 
  return list; 
}
function toBoolean(value) {
  if (value == "ON") {
    return true;
  } else {
    return false;
  }
}

// @desc    Displays search form for recipes
// @route   GET /recipe/search
// @access  Public
router.get("/search", (req, res, next) => {
  res.render("recipe/search");
});

// @desc    Displays add new recipe form
// @route   GET /recipe/new
// @access  User
router.get("/new", (req, res, next) => {
  res.render("recipe/newRecipe");
});

// @desc    Sends new recipe form
// @route   POST /recipe/new
// @access  User
router.post("/new", async (req, res, next) => {
  const { name, image, time, cuisine, kcal, spices, lactose, gluten, veggie, level, pax, username } = req.body;
  // define steps and username with JS func defined at this effect + change lactose, gluten and meet values form ON/OFF to true or false with JS func too
  const user = req.session.currentUser;
  try {
    const newRecipe = await Recipe.create({ name, image, time, cuisine, kcal, spices, lactose, gluten, veggie, level, pax, ingredients, steps, username });
    res.redirect("/", user, newRecipe);
  } catch(error) {
    next(error);
  }
});

// @desc    Displays edit recipe form
// @route   GET /recipe/:recipeId/edit
// @access  User
router.get("/:recipeId/edit", async (req, res, next) => {
  const { recipeId } = req.params;
  try {
    const recipe = await Recipe.findById(recipeId);
    res.redirect("/recipe/editRecipe", recipe);
  } catch(error) {
    next(error);
  }
});

// @desc    Sends edit recipe form data
// @route   POST /recipe/:recipeId/edit
// @access  User
router.post("/:recipeId/edit", async (req, res, next) => {
  const { recipeId } = req.params;
  const { name, image, time, cuisine, kcal, spices, lactose, gluten, veggie, level, pax, ingredients, steps, username } = req.body;
  try {
    const editedRecipe = await Recipe.findByIdAndUpdate(recipeId, {name, image, time, cuisine, kcal, spices, lactose, gluten, veggie, level, pax, ingredients, steps, username}, {new: true});
    res.redirect("/", editedRecipe);
  } catch(error) {
    next(error);
  }
});

module.exports = router;