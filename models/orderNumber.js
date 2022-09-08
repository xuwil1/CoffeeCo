const mongoose = require('mongoose');


const orderNumberSchema = new mongoose.Schema({
    number:{
        type: Number,
        default: 1
    },
    date:{
        type: Date,
        required: true,
        default: Date.now
    }
})
 
module.exports = mongoose.model('OrderNumberSchema', orderNumberSchema)