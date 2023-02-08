const router = require('express').Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const isLoggedIn = require("../middlewares/index");

const catchPhrases = [
  "Thanks to Food-Folio, we could finally got rid of Grandma.",
  "All of my favourite recipies are always handy, no more cooking notes!",
  "Food Folio really step up my cooking game. Don't waste time thinking what to cook, just find, choose and enjoy.",
  "You Shall Not Pass!",
  "We finally have a way to store all of our family recipes and traditions thanks to Food Folio.",
  "Your cooking will be more creative, engaging, purposeful and efficient. Give it a week... ",
  "If I could cook I'd definetely do with Food Folio by my side.",
  "Food Folio is the artery thourgh which the solutions of my cooking problems flow.",
  "Knowing what to cook empowers you you far beyond those who waste time surfing the internet to find recipes.",
  "There is no shame in admitting that you don't know how to cook. The only shame is not using Food Folio to amend it.",
  "I finally have a place to keep all my recipes, no time wasted on finding recipes among endless cooking notes.",
  "Totally recommended. This app is NUTS!!!",
  "Eating is necessary but cooking is an Art, be the artist.",
  "No one is born a great cook, but now you have no excuses to become a great one.",
  "Cooking is a caring and nurturing act. Kind of the ultimate gift for someone you love, with Food Folio is christmas every day.",
  "Don't know what to cook? Open the app.",
  "The secret ingredient for cooking used to be love, now its Food Folio!",
  
]

const catchAuthors = [
  "— Gordon Ramsay",
  "— Ferran Adrià",
  "— Random Guy",
  "— Alberto el Blanco",
  "— Slash",
  "— Steve Jobs",
  "— Stephen Hawking",
  "— Neil DeGrasse Tyson",
  "— Darleen Jake",
  "— Jamie Oliver",
  "— Sandra Hernandez",
  "— Scrat (Ice Age)",
  "— Patricia Costa da Cruz",
  "— Chat GPT",
  "— Santa Claus",
  "— Alberto Chicote",
  





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
