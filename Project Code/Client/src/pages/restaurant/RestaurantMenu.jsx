import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantMenu = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [AvailableCategories, setAvailableCategories] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);

  const [categoryFilter, setCategoryFilter] = useState([]);
  const [typeFilter, settypeFilter] = useState([]);

  // ✅ useCallback to prevent ESLint warnings about dependencies
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-categories');
      setAvailableCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  }, []);

  const fetchRestaurant = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-restaurant-details/${userId}`);
      setRestaurant(response.data);
    } catch (err) {
      console.error('Error fetching restaurant', err);
    }
  }, [userId]);

  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-items`);
      setItems(response.data);
      setVisibleItems(response.data);
    } catch (err) {
      console.error('Error fetching items', err);
    }
  }, []);

  useEffect(() => {
    fetchRestaurant();
    fetchCategories();
    fetchItems();
  }, [fetchRestaurant, fetchCategories, fetchItems]);

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    setCategoryFilter((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((cat) => cat !== value)
    );
  };

  const handleTypeCheckBox = (e) => {
    const value = e.target.value;
    settypeFilter((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  };

  const handleSortFilterChange = (e) => {
    const value = e.target.value;
    let sorted = [...visibleItems];

    if (value === 'low-price') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === 'high-price') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (value === 'discount') {
      sorted.sort((a, b) => b.discount - a.discount);
    } else if (value === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    setVisibleItems(sorted);
  };

  useEffect(() => {
    let filtered = [...items];

    if (categoryFilter.length > 0) {
      filtered = filtered.filter((product) => categoryFilter.includes(product.menuCategory));
    }

    if (typeFilter.length > 0) {
      filtered = filtered.filter((product) => typeFilter.includes(product.category));
    }

    setVisibleItems(filtered);
  }, [categoryFilter, typeFilter, items]);

  if (!restaurant) return <div style={{ padding: '20px' }}>Loading restaurant data...</div>;

  return (
    <div className="AllRestaurantsPage" style={{ marginTop: '14vh' }}>
      <div className="restaurants-container">
        <div className="restaurants-filter">
          <h4>Filters</h4>
          <div className="restaurant-filters-body">
            <div className="filter-sort">
              <h6>Sort By</h6>
              <div className="filter-sort-body sub-filter-body">
                {['popularity', 'low-price', 'high-price', 'discount', 'rating'].map((val, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sortFilter"
                      id={`sort-${val}`}
                      value={val}
                      onChange={handleSortFilterChange}
                    />
                    <label className="form-check-label" htmlFor={`sort-${val}`}>
                      {val.charAt(0).toUpperCase() + val.slice(1).replace('-', ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-categories">
              <h6>Food Type</h6>
              <div className="filter-categories-body sub-filter-body">
                {['Veg', 'Non Veg', 'Beverages'].map((type, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={type}
                      id={`type-${type}`}
                      checked={typeFilter.includes(type)}
                      onChange={handleTypeCheckBox}
                    />
                    <label className="form-check-label" htmlFor={`type-${type}`}>
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-categories">
              <h6>Categories</h6>
              <div className="filter-categories-body sub-filter-body">
                {AvailableCategories.map((category, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={category}
                      id={`cat-${idx}`}
                      checked={categoryFilter.includes(category)}
                      onChange={handleCategoryCheckBox}
                    />
                    <label className="form-check-label" htmlFor={`cat-${idx}`}>
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="restaurants-body">
          <h3>All Items</h3>
          <div className="restaurants">
            {visibleItems
              .filter((item) => item.restaurantId === restaurant._id)
              .map((item) => (
                <div className="restaurant-item" key={item._id}>
                  <div className="restaurant">
                    <img src={item.itemImg} alt={item.title} />
                    <div className="restaurant-data">
                      <h6>{item.title}</h6>
                      <p>{item.description.slice(0, 25)}...</p>
                      <h6>&#8377; {item.price}</h6>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate(`/update-product/${item._id}`)}
                      >
                        Update
                      </button>
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

export default RestaurantMenu;
