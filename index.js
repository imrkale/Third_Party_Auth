const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');

const app = express()
const PORT = process.env.PORT || 5000

require('./config/passport')(passport);

const DB = require('./config/keys').mongoURI
// Connect to MongoDB
mongoose
    .connect(
        DB,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(expressLayouts);
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))


app.use(
    session({
        secret: 'secret',
        cookie:{age: 3600},
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', require('./routes/initial.js'));
app.use('/users', require('./routes/users.js'));

app.listen(PORT, () => console.log('Listening to port: ' + PORT))