const express=require('express');
const router= express.Router();

const Orders = require('../models/orders');
const Coffees = require('../models/coffees'); 
const Number = require('../models/orderNumber');
let orderNumber;

async function getNumber(){
    let number = await Number.find();
    if(number.length==0){
        number= new Number();
        await number.save();
    }else{
        if(number[0].date.toISOString().split('T')[0]!==new Date().toISOString().split('T')[0]){
            number[0].number=1;
            number[0].date= new Date();
            await number[0].save();
        }
    }
    return number[0].number;
}
async function incNumber(){
    let number = await Number.find();
    if(number.length>0){
        number=number[0];
        number.number++;
        await number.save();
    }
    return number.number;
}
//cashier
router.get('/cashier', checkAuthenticated, async (req,res)=>{
    try{
        orderNumber = await getNumber();
        const coffees= await Coffees.find({orderNumber});
        res.render('orders/cashier', {
            account: req.user,
            coffees,
            orderNumber
        });
        
    } catch{
        res.send('error');
    }
})
router.post('/cashier', checkAuthenticated, async (req,res)=>{
    try{
        orderNumber = await getNumber();
        const coffee = new Coffees({
            orderNumber: orderNumber,
            coffeeType: req.body.coffeeType,
            size: req.body.size,
            iceAmount: req.body.iceAmount,
            additional: req.body.additional,
            number: req.body.number       
        })
        await coffee.save();
        const coffees= await Coffees.find({orderNumber});
        res.render('orders/cashier', {
            account: req.user,
            coffees,
            orderNumber
        });
    } catch{
        res.send('/');
    }


})
router.post('/checkout', checkAuthenticated, async (req,res)=>{
    try{
        orderNumber = await getNumber();
        var coffees= await Coffees.find({orderNumber});
        if(coffees.length==0){
            throw new Error('Nothing ordered');
        }
        let order = new Orders({
            number: orderNumber,
            order: coffees,
            cashier: req.user.firstName,
            custName: req.body.custName
        });
        await order.save();
        orderNumber = await incNumber();
        coffees= await Coffees.find({orderNumber});
        res.render('orders/cashier', {
            coffees,
            orderNumber,
            account: req.user
        });
    } catch{
        res.render('orders/cashier', {
            coffees,
            orderNumber,
            account: req.user
        });
    }
})
router.delete('/cashier/:id', checkAuthenticated, async (req,res)=>{
    let coffee
    try{
        orderNumber = await getNumber();
        coffee = await Coffees.findById(req.params.id);
        await coffee.remove();
        coffees= await Coffees.find({orderNumber});
        res.render('orders/cashier', {
            coffees,
            orderNumber,
            account: req.user
        });
    } catch{
        res.render('/');
    }
})

//barista
router.get('/barista', checkAuthenticated, async (req,res)=>{
    let searchOptions = {}
    let coffees=[]
    if(req.query.number != null & req.query.number >0){
        searchOptions.number = req.query.number;
    }
    try{
        const orders= await Orders.find(searchOptions);
        const coffees= await Coffees.find({});
        res.render('orders/barista', {
            orders,
            coffees,
            searchOptions: req.query,
            account: req.user
        });
    } catch{
        res.redirect('/');
    }
})
router.put('/barista/:id',checkAuthenticated, async(req,res)=>{
    let order
    try{
        order = await Orders.findById(req.params.id);
        if(order.completed){
            order.completed=false;
            order.barista= '';
        } else{
            order.completed = true;
            order.barista = req.user.firstName;
        }
        await order.save();
        const orders= await Orders.find();
        const coffees= await Coffees.find({});
        res.render('orders/barista', {
            orders,
            coffees,
            searchOptions: {},
            account: req.user
        });
    } catch{
        console.log('err');
        res.render('/');
    }
});
router.delete('/barista/:id', checkAuthenticated, async (req,res)=>{
    let order
    try{
        order = await Orders.findById(req.params.id);
        if(!order.completed){
            throw new Error('Cannot delete! Order incomplete!');
        }
        order.order.forEach(async coffee=>{
            coffee = await Coffees.findById(coffee);
            await coffee.remove();
        });
        await order.remove();
        const orders= await Orders.find();
        const coffees= await Coffees.find({});
        res.render('orders/barista', {
            orders,
            coffees,
            searchOptions: {},
            account: req.user
        });
    } catch(e){
        const orders= await Orders.find();
        const coffees= await Coffees.find({});
        res.render('orders/barista', {
            orders,
            coffees,
            searchOptions: {},
            account: req.user,
            errorMessage: e
        });
    }
})

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect('/login');
}

module.exports = router;