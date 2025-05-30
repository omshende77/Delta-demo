const express = require('express');
const user = require('../models/user.js'); 
const {userschema} = require('../schema.js');


//Signup route
module.exports.getSignup = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle user registration
module.exports.postSignup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new user({ username, email });
        const registeredUser = await user.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            return res.redirect('/listings');
        });
        
    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect('/signup'); 
    }
};

//Login route
module.exports.getLogin = (req, res) => {
    res.render("users/login.ejs");
};

// Handle user login
module.exports.postLogin = async (req, res) => {
    req.flash("success","Welcome Back to WanderLust");
    //console.log(req.session.redirectUrl);  //this is now undefined because we are using saveRedirectUrl middleware
    let redirectUrl = res.locals.redirectUrl || '/listings'; // Use session redirectUrl or default to '/listings'
    res.redirect(redirectUrl); // Redirect to the original URL or listings 
};

//Logout route
module.exports.logout = (req, res , next) => {
    req.logout((err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success","Logged Out Successfully!"); 
        res.redirect('/listings'); 
    });
};