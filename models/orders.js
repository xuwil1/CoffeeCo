const mongoose = require('mongoose');
const Coffees = require('../models/coffees'); 

const orderSchema = new mongoose.Schema({
    number:{
        type: Number,
        required: true
    },
    custName:{
        type: String,
        required: true
    },
    order:{
        type: [mongoose.Schema.ObjectId],
        required: true,
        ref: 'Coffees'
    },
    cashier:{
        type: String,
        required: true
    },
    barista:{
        type: String
    },
    completed:{
        type: Boolean,
        required: true,
        default: false
    },
    date:{
        type: Date,
        required: true,
        default: Date.now
    }
})
 
module.exports = mongoose.model('OrderSchema', orderSchema)