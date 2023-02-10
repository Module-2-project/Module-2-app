const router = require('express').Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const isLoggedIn = require("../middlewares/index");

const catchPhrases = [
  "Thanks to Food Folio, we can finally get rid of grandma. Well done.",
  "All of my favourite recipes are always handy, no more cooking notes, farewell paper...",
  "Food Folio is a step up in my cooking game. Don't waste time thinking about what to cook, just cook it.",
  "The dark fire will not avail you. Flame of Udun! Go back to the shadow. You Shall Not Pass!!!",
  "We finally have a way to store all of our family recipes and traditions thanks to Food Folio.",
  "Your cooking will become creative, engaging, purposeful and efficient. Give it a week... ",
  "If I could cook I'd definetely do it with Food Folio by my side.",
  "Food Folio is the artery through which the solutions of my cooking problems flow.",
  "Knowing what to cook empowers you far beyond those who waste time just to find recipes.",
  "No shame in admitting you don't know how to cook. The only shame is not using Food Folio to fix it.",
  "Perfect place to keep all my recipes, no more time wasted searching through cooking notes.",
  "I totally recommend it. What a tool this app is NUTS!!!",
  "Eating is my favourite hobby and it's necessary, but cooking is an Art, be the artist.",
  "No one is born a great cook, but now you have no excuses not to become a great one.",
  "Cooking is a caring act. The ultimate gift for someone you love, enjoy Christmas every day.",
  "Don't know what to cook? Open the app and mesmerize yourself.",
  "The secret ingredient for cooking used to be love, now it's Food Folio.",
  "It says only 5gr! Make it 20gr fam... Yoh! Where are my herbs at?!",
  "I cook with wine, sometimes I even add it to the food while cooking.",
  // "My one regret in life is that I'm not someone else.",
  "Like the rest of the important stuff in life... Just do it smarter, not harder",
  "Food Folio brings your kitchen to your fingertips...",
]
const catchAuthors = [
  "— Gordon Ramsay",
  "— Ferran Adrià",
  "— Michael Jordan",
  "— Alberto el Blanco",
  "— Sir David Attenborough",
  "— Steve Jobs",
  "— Stephen Hawking",
  "— Neil DeGrasse Tyson",
  "— Darleen Jake",
  "— Jamie Oliver",
  "— Sandra Hernandez",
  "— Scrat (Ice Age)",
  "— Patricia Costa da Cruz (AKA Presi)",
  "— Chat GPT",
  "— Santa Claus",
  "— Alberto Chicote",
  "— Bob Marley",
  "— Snoop Dogg",
  "— Woody Allen",
  "— Elon Musk",
  // "— Tupac Shakur",
  "— Nicholas James Vujicic",
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
    const userDB = await User.findById(user._id);
    res.render('index', {recipe: recipes, user: userDB, catchPhrase, catchAuthor});
  } catch(error) {
    next(error);
  }
});


module.exports = router;
