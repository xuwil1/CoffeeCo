const express=require('express');
const router= express.Router();

const bcrypt = require('bcrypt');
const passport = require('passport');
const Accounts = require('../models/accounts');

router.get('/', checkAuthenticated, (req,res)=>{
    res.render('index',{
         account: req.user}
    );
})

// login
router.get('/login', checkNotAuthenticated, (req,res)=>{
    res.render('login');
})
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true})
);

//register
router.get('/register', checkNotAuthenticated, (req,res)=>{
    res.render('register');
})
router.post('/register', checkNotAuthenticated, async(req,res)=>{ 
    try{
        let account = await new Accounts();
        account.firstName = req.body.firstName;
        account.lastName = req.body.lastName;
        account.email = req.body.email;
        if(await Accounts.findOne({email: req.body.email}).exec()){
            throw new Error('This email is already registered');
        }
        if(req.body.password==req.body.password2){
            //salt and hash password
            let hash = await bcrypt.hash(req.body.password, 10);
            account.password=hash;
        }else{
            throw new Error('Passwords do not match');
        }
        await account.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('login');
    } catch(e) {
        res.render('register', {
            firstName: req.body.firstName, 
            lastName: req.body.lastName, 
            email: req.body.email,
            errorMessage: e});
    }
})
router.get('/logout', (req,res)=>{
    req.logout((err)=> {
        if (err) {
          return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect("login");
      });
})
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect('/login');
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}
module.exports = router;