import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
// const [resturantName,setresturantName]=useState('');
 const addToCart = (itemId, foodItem,resturantName) => {
    setCartItems((prevItems) => ({
      ...prevItems,
      [itemId]: { quantity: (prevItems[itemId]?.quantity || 0) + 1, ...foodItem },
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
      console.log(total);
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
    removeFromCartCompletely
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export default CartContextProvider;
