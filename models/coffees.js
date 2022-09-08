const mongoose = require('mongoose');

const coffeeSchema= new mongoose.Schema({
    orderNumber:{
        type: Number,
        required: true
    },
    coffeeType:{
        type: String,
        required: true
    },
    size:{
        type: String,
        require: true
    },
    iceAmount:{
        type: String,
        required: true 
    },
    additional:{
        type: String, 
        required: false
    },
    number:{
        type: Number,
        required: false,
    }
})

module.exports= mongoose.model('CoffeeSchema', coffeeSchema)