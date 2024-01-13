const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ['italian', 'pizza', 'burger','chinese', 'healthy', 'fine dine','breakfast'],
        required: true,
    },
    picture: {
        type: String, 
    },
});

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    image:{
        type:String
    },
    category: {
        type: String,
        enum: ['veg', 'nonveg'],
        required: true,
    },
    foodItems: {
        type: [foodItemSchema], 
        validate: [arrayLimit, '{PATH} exceeds the limit of 10'], 
    },
});

function arrayLimit(val) {
    return val.length <= 10;
}

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
