if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');


const mongoose= require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error',(error)=>console.error(error));
db.once('open',()=>console.log('Connected to Database'));

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
app.set('view engine','ejs');
app.set('views', __dirname +'/views');
app.set('layout','layouts/layout');
app.use(expressLayouts);
// app.use(flash());
app.use(express.urlencoded({extended: false}));


app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.listen(3000);