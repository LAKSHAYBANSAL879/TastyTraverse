const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const ordersRouter = express.Router();

const { newOrder, getAllOrders } = require('../controllers/ordersController');
const Orders = require('../models/ordersModel'); 
ordersRouter.post('/newOrder', newOrder);
ordersRouter.get('/getAllOrders', getAllOrders);

ordersRouter.post('/create-payment-intent', async (req, res) => {
  
 console.log(process.env.STRIPE_SECRET);
    const {items} = req.body;
console.log(items);
 const lineItems=items.map((item)=>({
price_data:{
  currency:"inr",
  product_data:{
    name:item.name,
  },
    unit_amount:item.price*100,
},
quantity:item.quantity
  }));
const session=await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
line_items:lineItems,
mode:"payment",
success_url:"http://localhost:3000/success",
cancel_url:"http://localhost:3000/cancel"
})
res.json({id:session.id})
});
  

module.exports = ordersRouter;
