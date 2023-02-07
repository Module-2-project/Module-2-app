const router = require('express').Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const isLoggedIn = require("../middlewares/index");

const catchPhrases = [
  "Thanks to Food-Folio, we could finally got rid of Grandma.",
  "All of my favourite recipies are always handy, no more cooking notes! Just cuisine."
]

const catchAuthors = [
  "— Gordon Ramsay",
  "— Ferran Adrià",

]

function orderPhrase () { 
  return Math.floor(Math.random() * catchPhrases.length)

}

// @desc    App home page
// @route   GET /
// @access  Public

router.get('/', async (req, res, next) => {
  const user = req.session.currentUser;
  const randomPhrase = orderPhrase();
  const catchPhrase = catchPhrases[randomPhrase];
  const catchAuthor = catchAuthors[randomPhrase];

  try {
    const recipes = await Recipe.find();
    res.render('index', {recipe: recipes, user, catchPhrase, catchAuthor });
  } catch(error) {
    next(error);
  }
});


module.exports = router;
