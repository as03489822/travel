const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { equal } = require("joi");
const asyncWrap = require("../Errors/asyncWrap.js");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup" , (req ,res) => {
    res.render("user/signup.ejs");
})

router.post("/signup" ,asyncWrap (async(req , res) => {
    try{
        let {username , email , password} = req.body;
        let existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash("error", "Username already taken. Please choose another one.");
            return res.redirect("/signup");
        }
        console.log(username , email , password)
        let newUser = new User({username, email, password});
                console.log(newUser)
        newUser.save();
            req.flash("success" , " Welcome to Travels")
            res.redirect('/listing');
    }catch(er){
        req.flash("error" , er.message);
        res.redirect("/signup")
    }
}))

router.get("/login" , (req , res) => {
    res.render("user/login.ejs")
})

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req , res) => {
        req.flash("success" , "welcome back to Travels");
        if(res.locals.saveUrl){
        res.redirect(res.locals.saveUrl);
        }else{
        res.redirect("/listing");
        }
    //     try{
    //     let {username = "hello" , email , password} = req.body;
    //     let newUser = new User({username, email});
    //     let data = await User.register(newUser , password);
    //     console.log(data)
    //     req.login(data, function(err) {
    //         if (err) { return next(err); }
    //         req.flash("success" , " Welcome to Travels")
    //         res.redirect('/listing');
    //       });
    // }catch(er){
    //     req.flash("error" , er.message);
    //     res.redirect("/signup")
    // }
})

router.get("/logout" , (req ,res ,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listing");
    });
})

module.exports = router;    
