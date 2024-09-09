const express = require('express');
const router = express.Router();
const asyncWrap = require('../utils/wrapAsync.js');
const passport = require('passport');
const userController = require('../controllers/users.js');

router.route('/signup')
    .get(userController.signUpForm)
    .post(asyncWrap(userController.signupUser));

router.route('/login')
    .get(userController.loginForm)
    .post(passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.loginUser);

router.get('/logout', userController.logoutUser);

module.exports = router;