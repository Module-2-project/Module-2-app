const router = require('express').Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const isLoggedIn = require("../middlewares/index");

// @desc    App home page
// @route   GET /
// @access  Public
router.get('/', async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const recipes = await Recipe.find();
    res.render('index', {recipe: recipes, user});
  } catch(error) {
    next(error);
  }
});


module.exports = router;
