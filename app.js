if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
// console.log(process.env.secret)


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on('error', () => {
    console.log('An error occured in the MONGO SESSION STORE', err);
})
const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
        expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
    }
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then(() => { console.log('Succesfully Connected to DB!') }).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.listen(8080, () => {
    console.log('Listening on the Port 8080');
})
// app.get('/', (req, res) => {
//     res.send('You are on the root!')
// });
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})


app.use('/listings', listingsRouter);

app.use('/listings/:id/reviews', reviewsRouter);

app.use('/', userRouter);

// app.get('/demouser',async(req,res)=>
//     {
//         const user1 = new User({
//             email : 'student@email.com',
//             username : 'student12'
//         });
//       let newUser = await User.register(user1,'helloword');
//         res.send(newUser);
//     })


app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
})
// Creating Error handling Middleware
app.use((error, req, res, next) => {
    let { status = 500, message = "An Error Occured" } = error;
    res.status(status).render('listings/error.ejs', { status, message });
})