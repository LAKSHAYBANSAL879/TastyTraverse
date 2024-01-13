import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar,faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const RestaurantCard = ({ restaurant }) => {
    const getIconByCategory = () => {
        if (restaurant.category === 'veg') {
          return <FontAwesomeIcon icon={faCircleStop} className='text-green-500 text-2xl mt-1 mr-2' />;
        } else if (restaurant.category === 'nonveg') {
          return <FontAwesomeIcon icon={faCircleStop} className='text-red-500 text-2xl mt-1 mr-2' /> ;
        }
        
        return null;
      };
    
  return (
    <Link to={`/resturant/${restaurant.name}`} className='w-1/4' style={{ border: '1px solid #ccc', padding: '10px', margin: '20px', borderRadius: '8px' }}>
      <img src={restaurant.image || "https://b.zmtcdn.com/web_assets/81f3ff974d82520780078ba1cfbd453a1583259680.png"} alt={restaurant.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
      <div className='flex flex-col justify-center align-middle'>
        <div className='flex mx-auto mt-2'>
        <h3 className='text-2xl font-extrabold'>{restaurant.name}</h3>
        </div>
        <div className='flex justify-between font-bold'>
        <p>{restaurant.address}</p>
      <p><FontAwesomeIcon icon={faStar} className='text-yellow-300'/> {restaurant.rating}</p>
     
      
        </div>
        <div className='flex flex-col mt-2'>
            <h1 className='flex align-middle  ml-32 text-xl font-bold'>{getIconByCategory()}{restaurant.category}</h1>
            <div className='flex justify-center gap-2 font-bold mt-2'>
            <p className='border-r-4 pr-2'>{restaurant.foodItems[0].category}</p>
            {/* <p>{restaurant.foodItems[1].category}</p> */}
</div>
        </div>
        </div>
     
    
    </Link>
  );
};

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(null);
 
  useEffect(() => {
    // Fetch restaurants data from the API
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/resturant/getAllResturants');
        const { data, success, message } = await response.json();

        if (success) {
          console.log('API Response:', data);
          setRestaurants(data);
        } else {
          console.error('Error fetching restaurants:', message);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const nameMatch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const addressMatch = restaurant.address.toLowerCase().includes(searchTerm.toLowerCase());
    const ratingMatch = filterRating ? restaurant.rating >= parseInt(filterRating, 10) : true;
  

  
    return (nameMatch || addressMatch) && ratingMatch;

  });
  console.log('Filtered Restaurants:', filteredRestaurants);
  return (
    <div>
      <h2 className='flex text-3xl font-extrabold ml-10 mt-2 mb-2'>Best Selling Resturants</h2>
      <div className=''>
        <form className='flex flex-row justify-center gap-10'>
          <label>
           
            <input className='w-64 border-2 p-2 border-red-500 rounded-xl ' type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='search by name or address'/>
          </label>
          <label>
          <FontAwesomeIcon icon={faStar} className='text-yellow-400 text-xl mt-2'/>
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="">All</option>
              <option value="4"><FontAwesomeIcon icon={faStar} className='text-yellow-400'/> 4+</option>
              <option value="3">3+</option>
              <option value="2">2+</option>
              <option value="1">1+</option>
            </select>
          </label>
        </form>
      </div>
      <div className='justify-center' style={{ display: 'flex', flexWrap: 'wrap'  }}>
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantsList;
