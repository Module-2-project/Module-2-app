const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const User = require('../models/User');
const Recipe = require("../models/Recipe");
const {isLoggedIn, isAdmin} = require('../middlewares/index');

// @desc    Displays search form for recipes
// @route   GET /recipe/search
// @access  Public
//router.get();

module.exports = router;