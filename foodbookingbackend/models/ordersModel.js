const mongoose=require('mongoose');
const orderSchema = new mongoose.Schema({
    totalCost: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        restaurantName:{
          type:String,
        },
      },
    ],
    customerName: {
      type: String,
      required: true,
    },
   
},
{timestamps:true,
  });
  const Orders = mongoose.model("Orders", orderSchema);
module.exports=Orders;