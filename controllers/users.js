const User = require('../models/user.js');

module.exports.signUpForm = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.signupUser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let user = new User({ username, email });
        let newUser = await User.register(user, password);
        req.login(newUser, (error) => {
            if (error) {
                return next(error);
            }
            req.flash('success', 'Welcome to WanderLust');
            res.redirect('/listings');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Welcome back to WanderLust! you are logged in');
    res.redirect('/listings');
}

module.exports.logoutUser = (req, res, next) => {
    req.logOut((error) => {
        if (error) {
            return next(error);
        }
        req.flash('success', 'You are logged Out');
        res.redirect('/listings');
    })
}