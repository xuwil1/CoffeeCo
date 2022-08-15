const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.render('login.ejs');
})
router.post('/', async(req,res)=>{
    console.log('logined')
})


module.exports = router;