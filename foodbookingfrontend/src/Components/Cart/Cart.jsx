import React, { useContext, useEffect, useState } from "react";
import { CartContext, useCart } from "../../CartContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faRemove,faCopy } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from "../../UserContext";
import { Link, useNavigate } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js';

const Cart = () => {
  const { cartItems, getTotalItems, getTotalCost, removeFromCart, addToCart, itemTotal, removeFromCartCompletely } = useCart();


  const [foodItemDetails, setFoodItemDetails] = useState({});
  const { user, setUser } = useContext(UserContext);
  const [couponCode, setCouponCode] = useState('');
  const [discountedCost, setDiscountedCost] = useState(0);
  const Navigate = useNavigate();



  function couponFunc() {
    if (couponCode === "WELCOME100" && getTotalCost() > 250) {
      setDiscountedCost(getTotalCost() - 100);
      setCouponCode("");
    } else if (couponCode === "PRIME200" && getTotalCost() > 500) {
      setDiscountedCost(getTotalCost() - 200);
      setCouponCode("");
    } else {
      alert("Invalid coupon code");
      setDiscountedCost(getTotalCost());
    }
  }

  useEffect(() => {
    const fetchFoodItemDetails = () => {
      const details = {};
      for (const itemId in cartItems) {
        const { name, price, picture, description, _id,restaurantName } = cartItems[itemId];
        if (name && _id) {
          details[itemId] = { _id, name, picture, price, description, quantity: cartItems[itemId].quantity,restaurantName };
        }
      }
      setFoodItemDetails(details);
    };

    fetchFoodItemDetails();
  }, [cartItems]);

  useEffect(() => {
    setDiscountedCost(getTotalCost());
  }, [getTotalCost()]);

  const handleRemoveQuantity = (itemId) => {
    removeFromCart(itemId);
    if (cartItems[itemId].quantity === 0) {
      handleRemoveItem(itemId);
    }
  };

  // const handleAddToCart = (itemId) => {
  //   addToCart(itemId, {
  //     ...cartItems[itemId],
  //     quantity: cartItems[itemId].quantity + 1,
  //     restaurantName: cartItems[itemId]?.restaurantName,
  //   });
  // };
  const handleAddToCart = (restaurantName, itemId) => {
    const item = cartItems[itemId];
  
    if (item && item.quantity !== undefined) {
      const newItem = {
        ...item,
        quantity: item.quantity + 1,
        restaurantName: restaurantName ||item.restaurantName,
      };
  
      addToCart(itemId, newItem, restaurantName);
    } else {
      console.error(`Invalid item or quantity for itemId ${itemId}`);
    }
  };
  
  
  // const handleAddToCart = (restaurantName, itemId) => {
  //   const existingItem = cartItems[itemId];
  
  //   if (existingItem && existingItem.quantity !== undefined) {
  //     const newItem = {
  //       ...existingItem,
  //       quantity: existingItem.quantity + 1,
  //       restaurantName: cartItems[itemId]?.restaurantName, // Use the restaurantName from cartItems
  //     };
  
  //     console.log("Added to cart:", newItem);
  //     console.log(cartItems[itemId]?.restaurantName);
  
  //     addToCart(itemId, newItem);
  //   } else {
  //     console.error(`Invalid item or quantity for itemId ${itemId}`);
  //   }
  // };
  
  // const handleAddToCart = (restaurantName, itemId) => {
  //   const existingItem = cartItems[itemId];
  
  //   if (existingItem && existingItem.quantity !== undefined) {
  //     const newItem = {
  //       ...existingItem,
  //       quantity: existingItem.quantity + 1,
  //       restaurantName: restaurantName,
  //     };
  // console.log(restaurantName);
  //     addToCart(itemId, newItem,restaurantName);
  //   } else {
  //     console.error(`Invalid item or quantity for itemId ${itemId}`);
  //   }
  // };
  
  
  const handleRemoveItem = (itemId) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this item from the cart?");
    if (isConfirmed) {
      removeFromCartCompletely(itemId);
    }
  };

  const handleCheckout = async () => {
    try {
      const totalCost = discountedCost;
      const totalItems = getTotalItems();
      const items = Object.values(foodItemDetails).map((item) => ({
        name: item.name,
        _id: item._id,
        quantity: item.quantity,
        price: item.price,
        restaurantName: item.restaurantName,
      }));
      const customerName = user.name;
      console.log("iterms are",items);
      const response = await fetch('http://localhost:8080/api/v1/order/newOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalCost, totalItems, items, customerName }),
      });

      const result = await response.json();

      if (result.success) {
        handlePaymentRedirect();
      } else {
        alert('Failed to place the order. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  const handlePaymentRedirect = async () => {
    try {
      const items = Object.values(foodItemDetails).map((item) => ({
        name: item.name,
        _id: item._id,
        quantity: item.quantity,
        price: item.price,
      }));
      const stripe = await loadStripe("pk_test_51OWKAVSDJ0AxOUCaBITPNU4CmAR0Uey5xYo8uPMoVGjwox5LGoWkds5eg3WIFhLrcIZpNGQCzn6NWrhbP2AClk3k00CLeANSVp");
      const response = await fetch('http://localhost:8080/api/v1/order/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
      console.log("passing in stripe is :", items);
      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
        alert('Error during payment redirection. Please try again.');
      }
    } catch (error) {
      console.error('Error during payment redirection:', error);
      alert('An error occurred during payment redirection. Please try again.');
    }

  
  };


  return (
    <div className=" overflow-hidden">
      <h2 className="ml-20 mt-2 mb-2 text-4xl font-bold ">My Cart</h2>
      <div className="flex flex-row w-full gap-40 mb-2 ml-56 text-xl font-bold">
        <h1>Items</h1>
        <h1>Item Name</h1>
        <h1>Price</h1>
        <h1>Quantity</h1>
        <h1>Total</h1>
        <h1>Remove</h1>
      </div>
      {Object.entries(foodItemDetails).map(([itemId, item]) => (
        <div key={itemId}>
       
          <div className="flex flex-row justify-evenly w-full font-extrabold mt-2">
            <img src={item.picture} alt="" className="w-28 h-32 p-2" />
            <p className="">{item.name}</p>
            <p>Rs:{item.price}</p>
            <p><FontAwesomeIcon icon={faMinus} className="cursor-pointer text-white bg-red-500 p-1 rounded-3xl" onClick={() => handleRemoveQuantity(itemId)} /> <span className="border-2 p-1">{item.quantity}</span><FontAwesomeIcon icon={faPlus} onClick={() => handleAddToCart(item.restaurantName, itemId)} className="bg-red-500 text-white p-1 rounded-3xl cursor-pointer" /></p>
            <p>Rs{itemTotal(itemId)}</p>
            <p><FontAwesomeIcon icon={faRemove} className="cursor-pointer" onClick={() => handleRemoveItem(itemId)} /></p>
          </div>
          <hr />
        </div>
      ))}
      <div className="flex flex-row ">
        <div className="flex flex-col w-1/2">
          <h1 className="text-4xl font-bold ml-10 mt-2 mb-2">Cart Total</h1>
          <div className="flex flex-col justify-around ml-10 text-xl gap-2 font-bold p-2 w-1/2">
            <p className="flex justify-between border-b-4  border-b-gray-400 flex-row"><span>Total Items: </span> <span>{getTotalItems()}</span></p>
            <p className="flex justify-between border-b-4 border-b-gray-400 flex-row"><span>Delivery Charges: </span> <span>Free</span></p>
            <p className="flex justify-between border-b-4 border-b-gray-400 flex-row"><span>Total Cost: </span> <span className="text-red-500 text-xl">Rs{getTotalCost()}</span></p>
            <p className="flex justify-between border-b-4 border-b-gray-400 flex-row"><span>Discounted Cost: </span> <span className="text-green-400 text-2xl">Rs{discountedCost}</span></p>
            <button onClick={handleCheckout} className="bg-red-500 text-white rounded-xl p-2">Proceed to Checkout</button>
          </div>
        </div>
        <div className="flex flex-col align-middle w-1/2">
          <h1 className="text-4xl font-bold ml-10 mt-2 mb-2">Having Coupon?</h1>
          <input type="text" name="coupon" id="coupon" className="border-2 border-gray-400 ml-8 mt-2 p-2 rounded-2xl w-1/2 font-bold text-xl" placeholder="Enter your coupon code " value={couponCode} onChange={ev => setCouponCode(ev.target.value)} />
          <button className="bg-red-500 w-fit ml-10 mt-3 font-bold text-xl text-white rounded-xl p-2" onClick={(e) => { e.preventDefault(); couponFunc(); }}>Apply</button>
          <div className="flex flex-col justify-center align-middle ml-10">
            <div>
              <h1 className="flex text-2xl font-bold m-2">Available Coupons</h1>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col justify-center align-middle gap-2 border-2 rounded-2xl border-black p-2 text-lg w-fit">
                <h1>Get flat <span className="text-2xl font-extrabold underline">Rs100 off</span> on first 5 purchase</h1>
                <h2>Use Code <span className="font-bold text-2xl text-red-500" id="coupon" value={couponCode}>WELCOME100 </span><FontAwesomeIcon icon={faCopy} onClick={() => { setCouponCode("WELCOME100"); alert("coupon code copied successfully") }} className=" cursor-pointer text-black text-lg ml-3" /></h2>
                <h3>T.C order value must be greater than 250</h3>
              </div>
              <div className="flex flex-col justify-center align-middle gap-2 border-2 rounded-2xl border-black p-2 text-lg w-fit">
                <h1>Get flat <span className="text-2xl font-extrabold underline">Rs200 off</span> on first 5 purchase</h1>
                <h2>Use Code <span className="font-bold text-2xl text-red-500" id="coupon" value={couponCode}>PRIME200 </span><FontAwesomeIcon icon={faCopy} onClick={() => { setCouponCode("PRIME200"); alert("coupon code copied successfully") }} className=" cursor-pointer text-black text-lg ml-3" /></h2>
                <h3>T.C order value must be greater than 500</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
