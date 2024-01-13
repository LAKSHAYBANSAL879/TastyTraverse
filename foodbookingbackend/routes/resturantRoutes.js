const express = require("express");
const resturantRouter = express.Router();
const cookieParser = require('cookie-parser');
const JWT=require('jsonwebtoken');
const crypto=require('crypto')

const{
addRestaurant,
getAllRestaurants,
getRestaurantByName
} = require("../controllers/resturantController.js");

resturantRouter.post('/newResturant', addRestaurant);
resturantRouter.get('/getAllResturants',getAllRestaurants);
resturantRouter.get('/getResturant/:name', getRestaurantByName);


module.exports = resturantRouter;
