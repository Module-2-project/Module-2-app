const express = require('express');
const router = express.Router();
const User = require('../models/User');
const isLoggedIn = require('../middlewares');
const recipe = require ('../models/Recipe');

router.get('/profile', isLoggedIn,  function (req,res,next){
const user = req.session.currentUser;
res.render('profile', user);
});

