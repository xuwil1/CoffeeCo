const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Accounts = require('../../models/accounts');

module.exports =  function(passport){
     passport.use(
         new LocalStrategy({ usernameField: 'email'}, async (email, password, done)=>{
            let account;
            try{
                account = await Accounts.findOne({email: email})
                if(account==null){
                    return done(null,false, {message: 'That email is not registered'});
                }
                if (await bcrypt.compare(password, account.password)){
                    return done(null,account);
                }else{
                    return done (null, false, {message: 'Password incorrect'})
                }
            }
            catch(err){
                console.log(err);
            }
        })
    );
    passport.serializeUser((account,done)=>{
        done(null, account.id);
    });
    passport.deserializeUser((id,done) => {
        Accounts.findById(id,(err,account)=>{
            done(err,account);
        })
    })
};