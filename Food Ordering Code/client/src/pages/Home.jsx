import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import PopularRestaurants from '../components/PopularRestaurants';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:6001/fetch-restaurants');
        setRestaurants(response.data);
      } catch (err) {
        setError('Failed to fetch restaurants. Please try again later.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="HomePage">

      <div className="home-categories-container">

        <div className="home-category-card" onClick={() => navigate('/category/Breakfast')}>
          <img src="https://www.lacademie.com/wp-content/uploads/2022/03/indian-breakfast-recipes-500x500.jpg" alt="Breakfast category" />
          <h5>Breakfast</h5>
        </div>

        <div className="home-category-card" onClick={() => navigate('/category/Biriyani')}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4-VXaTJIkc6rk02DU8r7r9zR-KaeWvH1oKA&usqp=CAU" alt="Biriyani category" />
          <h5>Biriyani</h5>
        </div>

        <div className="home-category-card" onClick={() => navigate('/category/Pizza')}>
          <img src="https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTh8fHxlbnwwfHx8fHw%3D&w=1000&q=80" alt="Pizza category" />
          <h5>Pizza</h5>
        </div>

        <div className="home-category-card" onClick={() => navigate('/category/Noodles')}>
          <img src="https://www.licious.in/blog/wp-content/uploads/2022/12/Shutterstock_2176816723.jpg" alt="Noodles category" />
          <h5>Noodles</h5>
        </div>

        <div className="home-category-card" onClick={() => navigate('/category/Burger')}>
          <img src="https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2021/09/beef-burger.jpg?im=AspectCrop=(16,9);" alt="Burger category" />
          <h5>Burger</h5>
        </div>

      </div>

      <PopularRestaurants />

      <div className="restaurants-container">
        <div className="restaurants-body">
          <h3>All restaurants</h3>

          {loading && <p>Loading restaurants...</p>}
          {error && <p style={{color: 'red'}}>{error}</p>}

          <div className="restaurants">
            {!loading && !error && restaurants.map((restaurant) => (
              <div className="restaurant-item" key={restaurant._id}>
                <div className="restaurant" onClick={() => navigate(`/restaurant/${restaurant._id}`)}>
                  <img src={restaurant.mainImg} alt={restaurant.title} />
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

      <Footer />
    </div>
  );
};

export default Home;
