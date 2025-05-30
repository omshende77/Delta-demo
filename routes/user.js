const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const UserController = require('../controllers/users.js');


router.route("/signup")
//Signup route
    .get(UserController.getSignup)

// Handle user registration
    .post(wrapAsync(UserController.postSignup));



router.route('/login')
//Login route
    .get(UserController.getLogin)

// Handle user login
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect :"/login",failureFlash :true}),wrapAsync(UserController.postLogin));

    

//Logout route    
router.get('/logout', UserController.logout);


module.exports = router;