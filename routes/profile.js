const express = require('express');
const router = express.Router();
const User = require('../models/User');
const isLoggedIn = require('../middlewares');
const recipe = require ('../models/Recipe');
const userRouter = require('../models/User');

// console.log('coming from profile.js');


//---------// Not showing username
router.get('/profile', isLoggedIn,  function (req,res,next) {
const user = req.session.currentUser;
res.render('/auth/profile' , {user : user})
}); 

//---------// 


module.exports = router;

