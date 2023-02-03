const router = require('express').Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const isLoggedIn = require("../middlewares/index");

// @desc    App home page
// @route   GET /
// @access  Public
router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
  res.render('index', {user});
});

module.exports = router;
