import React, { useEffect, useState } from 'react';
import '../../styles/Restaurants.css';
import axios from 'axios';

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-restaurants');

      // Add a famous restaurant manually
      const famousRestaurant = {
        _id: '999',
        title: 'Barbeque Nation',
        address: '5th Floor, Inorbit Mall, Hyderabad',
        mainImg: 'https://source.unsplash.com/400x300/?barbeque'
      };

      setRestaurants([...response.data, famousRestaurant]);
    } catch (error) {
      console.error('Error fetching restaurants:', error.message);
    }
  };

  return (
    <div className="AllRestaurantsPage" style={{ marginTop: '14vh' }}>
      <div className="restaurants-container">
        <div className="restaurants-body">
          <h3>All restaurants</h3>
          <div className="restaurants">
            {restaurants.map((restaurant) => (
              <div className="restaurant-item" key={restaurant._id}>
                <div className="restaurant">
                  <img src="https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/content12330.jpg" alt="Barbeque Nation" />
                  <div className="restaurant-data">
                    <h6>{restaurant.title}</h6>
                    <p>{restaurant.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRestaurants;
