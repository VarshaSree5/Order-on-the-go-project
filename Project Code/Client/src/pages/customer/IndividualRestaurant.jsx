import React, { useCallback, useEffect, useState, useContext } from 'react';
import '../../styles/IndividualRestaurant.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { GeneralContext } from '../../context/GeneralContext';

const IndividualRestaurant = () => {
  const { fetchCartCount } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);

  const [sortFilter, setSortFilter] = useState('popularity');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);

  const [cartItem, setCartItem] = useState('');
  const [quantity, setQuantity] = useState(1);

  const fetchRestaurant = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-restaurant/${id}`);
      setRestaurant(res.data);
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
    }
  }, [id]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-categories');
      if (res.data.length > 0 && typeof res.data[0] === 'object' && res.data[0].name) {
        setAvailableCategories(res.data.map(cat => cat.name));
      } else {
        setAvailableCategories(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-items');
      setItems(res.data);
      setVisibleItems(res.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  }, []);

  useEffect(() => {
    fetchRestaurant();
    fetchCategories();
    fetchItems();
  }, [fetchRestaurant, fetchCategories, fetchItems]);

  useEffect(() => {
    let filtered = items.filter(item => item.restaurantId === id);

    if (categoryFilter.length > 0) {
      filtered = filtered.filter(item =>
        categoryFilter.some(
          cat => cat.toLowerCase() === (item.menuCategory || '').toLowerCase()
        )
      );
    }

    if (typeFilter.length > 0) {
      filtered = filtered.filter(item =>
        typeFilter.some(
          t => t.toLowerCase() === (item.category || '').toLowerCase()
        )
      );
    }

    if (sortFilter === 'low-price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortFilter === 'high-price') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortFilter === 'discount') {
      filtered.sort((a, b) => b.discount - a.discount);
    } else if (sortFilter === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setVisibleItems(filtered);
  }, [categoryFilter, typeFilter, sortFilter, items, id]);

  const handleCategoryCheckBox = e => {
    const value = e.target.value;
    setCategoryFilter(prev =>
      e.target.checked ? [...prev, value] : prev.filter(v => v !== value)
    );
  };

  const handleTypeCheckBox = e => {
    const value = e.target.value;
    setTypeFilter(prev =>
      e.target.checked ? [...prev, value] : prev.filter(v => v !== value)
    );
  };

  const handleSortFilterChange = e => {
    setSortFilter(e.target.value);
  };

  const handleAddToCart = async (item) => {
    if (quantity < 1) {
      alert('Please enter a valid quantity');
      return;
    }
    try {
      await axios.post('http://localhost:6001/add-to-cart', {
        userId,
        foodItemId: item._id,
        foodItemName: item.title,
        restaurantId: item.restaurantId,
        foodItemImg: item.itemImg,
        price: item.price,
        discount: item.discount,
        quantity,
      });
      alert(`Added ${quantity} x ${item.title} to cart!`);
      setCartItem('');
      setQuantity(1);
      fetchCartCount();
    } catch (error) {
      alert('Failed to add to cart');
      console.error('Add to cart error:', error);
    }
  };

  if (!restaurant) return <p>Loading restaurant...</p>;

  return (
    <div className="IndividualRestaurant-page">
      <h2>{restaurant.title}</h2>
      <p>{restaurant.address}</p>

      <div className="IndividualRestaurant-body">
        <div className="restaurants-menu-filter">
          <h4>Filters</h4>

          <div className="restaurant-menu-filters-body">
            <h6>Sort By</h6>
            <div className="menu-sub-filter-body">
              {['popularity', 'low-price', 'high-price', 'discount', 'rating'].map(option => (
                <div key={option}>
                  <input
                    type="radio"
                    name="sortFilter"
                    value={option}
                    checked={sortFilter === option}
                    onChange={handleSortFilterChange}
                    id={`sort-${option}`}
                  />
                  <label htmlFor={`sort-${option}`}>{option}</label>
                </div>
              ))}
            </div>

            <h6>Food Type</h6>
            <div className="menu-sub-filter-body">
              {['Veg', 'Non Veg', 'Beverages'].map((type, idx) => (
                <div key={idx}>
                  <input
                    type="checkbox"
                    value={type}
                    checked={typeFilter.includes(type)}
                    onChange={handleTypeCheckBox}
                    id={`type-${type}`}
                  />
                  <label htmlFor={`type-${type}`}>{type}</label>
                </div>
              ))}
            </div>

            <h6>Menu Categories</h6>
            <div className="menu-sub-filter-body">
              {availableCategories.map((cat, idx) => (
                <div key={idx}>
                  <input
                    type="checkbox"
                    value={cat}
                    checked={categoryFilter.includes(cat)}
                    onChange={handleCategoryCheckBox}
                    id={`cat-${cat}`}
                  />
                  <label htmlFor={`cat-${cat}`}>{cat}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="restaurants-menu-body">
          <h3>Menu</h3>
          <div className="restaurants-menu">
            {visibleItems.map(item => (
              <div className="restaurant-menu-item" key={item._id}>
                <div className="restaurant-dish">
                  <img src={item.itemImg} alt={item.title} />
                  <div className="restaurant-dish-data">
                    <h6>{item.title}</h6>
                    <p>{item.description}</p>
                    <h5>
                      ₹{Math.round(item.price - (item.price * item.discount) / 100)}
                      <s>{item.price}</s>
                    </h5>

                    {cartItem === item._id ? (
                      <>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={e => setQuantity(Number(e.target.value))}
                          style={{ width: '60px' }}
                        />
                        <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                      </>
                    ) : (
                      <button onClick={() => setCartItem(item._id)}>Add Item</button>
                    )}
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

export default IndividualRestaurant;
