if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const express = require('express');
const app = express();

const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');


require('./public/javascripts/passport-config')(passport);

const mongoose= require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error',(error)=>console.error(error));
db.once('open',()=>console.log('Connected to Database'));

const indexRouter = require('./routes/index.js');
const ordersRouter = require('./routes/orders.js');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
})); 

app.use(flash());

app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.set('view engine','ejs');
app.set('views', __dirname +'/views');
app.set('layout','layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);
app.use('/', ordersRouter);
app.listen(process.env.PORT || 3000);