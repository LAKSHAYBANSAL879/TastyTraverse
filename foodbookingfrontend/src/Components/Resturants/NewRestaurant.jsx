import React, { useState } from 'react';
import axios from 'axios';

export default function AddRestaurant() {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [foodItems, setFoodItems] = useState([
    { name: '', description: '', price: 0, category: '', picture: '' },
  ]);

  async function saveRestaurant(ev) {
    ev.preventDefault();
  
    const nonEmptyFoodItems = foodItems.filter(item => item.name !== '');
  
    const restaurantData = {
      name: title,
      address,
      rating,
      image,
      category,
      foodItems: nonEmptyFoodItems,
    };
  
    try {
      await axios.post('http://localhost:8080/api/v1/resturant/newResturant', restaurantData);
      alert('New restaurant has been added successfully');
    } catch (error) {
      console.error('Error saving restaurant:', error);
    }
  }

  return (
    <div className="overflow-hidden">
      <form
        onSubmit={saveRestaurant}
        className="w-full max-w-2xl mx-auto mt-8 p-8 border border-gray-300 rounded-md"
      >
        <h2 className="text-2xl font-bold mb-4">Add New Restaurant</h2>

        <div className="mb-4">
          <label htmlFor="Name" className="block text-lg  font-bold text-gray-600">
            Restaurant Name
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            placeholder="Title"
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-lg font-bold text-gray-600">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
            placeholder="Address"
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="rating" className="block text-lg  font-bold text-gray-600">
            Rating (0-5)
          </label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={rating}
            onChange={(ev) => setRating(ev.target.value)}
            placeholder="Rating"
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-lg  font-bold text-gray-600">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={image}
            onChange={(ev) => setImage(ev.target.value)}
            placeholder="Image URL"
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-lg font-bold text-gray-600">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
            placeholder="Category"
            className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Food Items Section */}
        <div className="mb-4">
          <h3 className="text-xl font-extrabold mb-2">Food Items</h3>
          {foodItems.map((item, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`foodItemName${index}`} className="block text-sm font-medium text-gray-600">
                Food Item Name
              </label>
              <input
                type="text"
                id={`foodItemName${index}`}
                name={`foodItems[${index}].name`}
                value={item.name}
                onChange={(ev) => handleFoodItemChange(ev, index, 'name')}
                placeholder="Food Item Name"
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />

              <label htmlFor={`foodItemPrice${index}`} className="block text-sm font-medium text-gray-600">
                Price
              </label>
              <input
                type="number"
                id={`foodItemPrice${index}`}
                name={`foodItems[${index}].price`}
                value={item.price}
                onChange={(ev) => handleFoodItemChange(ev, index, 'price')}
                placeholder="Price"
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />

              <label htmlFor={`foodItemDescription${index}`} className="block text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                id={`foodItemDescription${index}`}
                name={`foodItems[${index}].description`}
                value={item.description}
                onChange={(ev) => handleFoodItemChange(ev, index, 'description')}
                placeholder="Description"
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />

              <label htmlFor={`foodItemCategory${index}`} className="block text-sm font-medium text-gray-600">
                Category
              </label>
              <input
                type="text"
                id={`foodItemCategory${index}`}
                name={`foodItems[${index}].category`}
                value={item.category}
                onChange={(ev) => handleFoodItemChange(ev, index, 'category')}
                placeholder="Category"
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />

              <label htmlFor={`foodItemPicture${index}`} className="block text-sm font-medium text-gray-600">
                Picture URL
              </label>
              <input
                type="text"
                id={`foodItemPicture${index}`}
                name={`foodItems[${index}].picture`}
                value={item.picture}
                onChange={(ev) => handleFoodItemChange(ev, index, 'picture')}
                placeholder="Picture URL"
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          ))}

          <button
            className="bg-blue-500 text-white font-bold rounded-md p-2"
            onClick={(ev) => handleAddFoodItem(ev)}
          >
            Add Food Item
          </button>
        </div>

        <button className="bg-red-500 text-white font-bold rounded-md p-2" type="submit">
          Save Restaurant
        </button>
      </form>
    </div>
  );

  function handleFoodItemChange(ev, index, field) {
    const { value } = ev.target;
    const updatedFoodItems = [...foodItems];
    updatedFoodItems[index][field] = value;
    setFoodItems(updatedFoodItems);
  }

  function handleAddFoodItem(ev) {
    ev.preventDefault();
    setFoodItems([...foodItems, { name: '', description: '', price: 0, category: '', picture: '' }]);
  }
}
