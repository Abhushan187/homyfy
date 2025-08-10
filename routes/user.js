const express=require("express");
const router=express.Router();
const User=require("../user.js");
const wrapAsync=require("../utils/wrapAsync.js")
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/users.js");            //making code moduler using controller 

router
  .route("/signup")
  .get(userController.renderSignupForm)       //basically a route to sign up form
  .post(wrapAsync(userController.signup));   //signing up new user

router
  .route("/login")
  .get(userController.renderLoginForm)     //route for login form
  .post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
  }),userController.login
);                                                   ////login done using passport methods

//logout using passport methods here as well
router.get("/logout",userController.logout);

module.exports=router;