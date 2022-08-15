const express = require('express');
const router = express.Router();
const Accounts = require('../models/accounts');

router.get('/', (req,res)=>{
    res.render('register.ejs');
})
router.post('/', async(req,res)=>{
    
    try{
        let account = new Accounts();
        account.firstName = req.body.firstName;
    } catch{

    }
})

module.exports = router;

