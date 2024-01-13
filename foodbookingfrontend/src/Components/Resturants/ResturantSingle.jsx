import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faLocationPin, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../CartContext';

const RestaurantSingle = () => {
  const { title } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const { cartItems, addToCart, removeFromCart, getTotalItems } = useCart();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/resturant/getResturant/${title}`);
        const { data, success, message } = await response.json();

        if (success) {
          console.log('API Response:', data);
          setRestaurant(data);
          setFilteredFoodItems(data.foodItems);
        } else {
          console.error('Error fetching restaurant:', message);
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    };

    fetchRestaurant();
  }, [title]);

  useEffect(() => {
    let filteredItems = [...(restaurant?.foodItems || [])];

    if (categoryFilter !== 'all') {
      filteredItems = filteredItems.filter((item) => item.category === categoryFilter);
    }

    let sortedItems = [...filteredItems];

    if (sortOrder === 'asc') {
      sortedItems.sort((a, b) => a.price - b.price);
    } else {
      sortedItems.sort((a, b) => b.price - a.price);
    }

    if (searchTerm) {
      sortedItems = sortedItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFoodItems(sortedItems);
  }, [categoryFilter, sortOrder, searchTerm, restaurant]);

  if (!restaurant) {
    return <p>Loading...</p>;
  }

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  const handleAddToCart = (itemId, foodItem) => {
    addToCart(itemId, {
      ...foodItem,
      name: foodItem.name,
      price: foodItem.price,
      description: foodItem.description,
      picture: foodItem.picture,
    });
  };
  
  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  console.log('Cart Items:', cartItems);
  console.log("total items are",getTotalItems());
  return (
    <div>
      <div className='flex flex-col justify-center align-middle items-center border-b-4 pb-2 border-b-gray-300 w-3/4 mx-auto'>
        <div className='flex text-5xl font-extrabold mt-2'>
          <h2>{restaurant.name}</h2>
        </div>
        <div>
          <h1 className='uppercase text-green-600 text-xl font-bold mt-2'>{restaurant.category}</h1>
        </div>
        <div className='flex flex-row gap-20 mt-3 text-xl font-bold'>
          <p>
            <FontAwesomeIcon icon={faLocationPin} className='' /> {restaurant.address}
          </p>
          <p>
            <FontAwesomeIcon icon={faStar} className='text-yellow-400' />
            {restaurant.rating}
          </p>
        </div>
        <div>
          <div className='flex flex-row gap-20 mt-3 font-bold '>
            <select className='border-2 rounded-xl p-2 focus:border-black' onChange={(e) => handleCategoryChange(e.target.value)} value={categoryFilter}>
              <option value="all">All Categories</option>
              {['pizza', 'breakfast', 'healthy', 'italian', 'chinese'].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select className='border-2 rounded-xl p-2 focus:border-black' onChange={(e) => handleSortOrderChange(e.target.value)} value={sortOrder}>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
            <input
              type="text"
              placeholder="Search by name or description"
              value={searchTerm}
              className='border-2 rounded-xl p-2 focus:border-black w-64'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <h3 className='flex ml-20 text-3xl font-extrabold'>Popular Food Items</h3>
      <div className='flex flex-col w-1/2 mx-auto h-32'>
        {filteredFoodItems.map((foodItem) => (
          <div
            className='flex flex-row justify-between'
            key={foodItem._id}
            style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '8px' }}
          >
            <div className='flex flex-col gap-2 w-3/4'>
              <h4 className='text-2xl font-bold'>{foodItem.name}</h4>
              <p className='font-bold text-xl'>Rs:{foodItem.price}</p>
              <p className='font-semibold text-gray-800'>{foodItem.description}</p>
            </div>
            <div className='flex flex-col'>
              {foodItem.picture && (
                <img src={foodItem.picture} alt={foodItem.name} style={{ width: '120px', height: '100px', borderRadius: '8px' }} />
              )}
              {cartItems[foodItem._id]?.quantity > 0 ? (
                <div className='flex items-center mt-2'>
                  <button
                    className='p-2 bg-red-500 font-bold text-white rounded-xl'
                    onClick={() => handleRemoveFromCart(foodItem._id)}
                  >
                    -
                  </button>
                  <span className='mx-2'>{cartItems[foodItem._id].quantity}</span>
                  <button
                    className='p-2 bg-red-500 font-bold text-white rounded-xl'
                    onClick={() => handleAddToCart(foodItem._id,foodItem)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  className='flex p-2 bg-red-500 font-bold text-white rounded-xl mt-2'
                  onClick={() => addToCart(foodItem._id)}
                >
                  Add to cart<FontAwesomeIcon icon={faPlus} className='mt-1 ml-1 font-bold'/>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantSingle;
