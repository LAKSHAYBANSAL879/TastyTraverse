
import React, { createContext, useState, useContext, useEffect } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  const addToCart = (itemId, foodItem,restaurantName) => {
    console.log('Adding to cart:', itemId, foodItem, restaurantName);

    setCartItems((prevItems) => ({
      ...prevItems,
      [itemId]: { ...foodItem,restaurantName, quantity: (prevItems[itemId]?.quantity || 0) + 1 },
    }));
  };

  const removeFromCart = (itemId) => {
    if (cartItems[itemId]?.quantity > 0) {
      setCartItems((prevItems) => {
        const updatedItems = { ...prevItems };
        updatedItems[itemId].quantity -= 1;
        return updatedItems;
      });
    }
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((total, item) => total + item.quantity, 0);
  };

  const itemTotal = (itemId) => {
    const item = cartItems[itemId];

    if (item && item.price && item.quantity) {
      const total = item.price * item.quantity;
      return total;
    }

    return 0;
  };

  const getTotalCost = () => {
    let totalCost = 0;

    for (const itemId in cartItems) {
      totalCost += cartItems[itemId].price * cartItems[itemId].quantity;
    }

    return totalCost;
  };

  const removeFromCartCompletely = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      delete updatedItems[itemId];
      return updatedItems;
    });
  };

  const contextValue = {
    cartItems,
    
    addToCart,
    removeFromCart,
    getTotalItems,
    getTotalCost,
    itemTotal,
    removeFromCartCompletely,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
export default CartContextProvider;
