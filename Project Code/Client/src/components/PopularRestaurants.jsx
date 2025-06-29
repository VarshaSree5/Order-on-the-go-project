import React, { useEffect, useState } from 'react';
import '../styles/PopularRestaurants.css';
import { useNavigate } from 'react-router-dom';

const PopularRestaurants = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [promoteList, setPromoteList] = useState([]);

  useEffect(() => {
    // ✅ Only one mock restaurant
    const mockRestaurants = [
      {
        _id: '101',
        title: 'Tandoori Flame',
        address: '12 Spice Street, Hyderabad',
        mainImg: 'https://source.unsplash.com/400x300/?tandoori'
      }
    ];

    const mockPromoted = ['101']; // Only promoting this one

    setRestaurants(mockRestaurants);
    setPromoteList(mockPromoted);
  }, []);

  return (
    <div className="popularRestaurantContainer">
      <h3>Popular Restaurants</h3>
      <div className="popularRestaurant-body">
        {restaurants
          .filter((restaurant) => promoteList.includes(restaurant._id))
          .map((restaurant) => (
            <div
              className="popularRestaurantCard"
              key={restaurant._id}
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr8eckIRPUD4dyVkCHgET5u0KX2yz6o_bn2g&s"
                alt={`${restaurant.title} - ${restaurant.address}`}
              />
              <div className="popularRestaurantCard-data">
                <h6>{restaurant.title}</h6>
                <p>{restaurant.address}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PopularRestaurants;
