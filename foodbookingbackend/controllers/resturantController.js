const Restaurant = require('../models/resturantModel');

exports.addRestaurant = async (req, res) => {
    try {
        const { name, address, rating, category, foodItems,image } = req.body;

        const newRestaurant = new Restaurant({
            name,
            address,
            rating,
            category,
            foodItems,
            image,
        });

        const savedRestaurant = await newRestaurant.save();

        res.status(201).json({
            success: true,
            message: 'Restaurant added successfully',
            data: savedRestaurant,
        });
    } catch (error) {
        console.error('Error adding restaurant:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error adding restaurant',
            error: error.message,
        });
    }
};
exports.getAllRestaurants = async (req, res) => {
    try {
        const allRestaurants = await Restaurant.find();

        res.status(200).json({
            success: true,
            message: 'All restaurants retrieved successfully',
            data: allRestaurants,
        });
    } catch (error) {
        console.error('Error fetching all restaurants:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching all restaurants',
            error: error.message,
        });
    }
};
exports.getRestaurantByName = async (req, res) => {
    const { name } = req.params;

    try {
        const restaurant = await Restaurant.findOne({ name });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Restaurant retrieved successfully',
            data: restaurant,
        });
    } catch (error) {
        console.error('Error fetching restaurant by name:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching restaurant by name',
            error: error.message,
        });
    }
};
