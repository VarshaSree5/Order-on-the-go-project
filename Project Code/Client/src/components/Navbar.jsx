// components/Navbar.js
import React, { useContext, useEffect, useState } from 'react';
import { BsCart3, BsPersonCircle } from 'react-icons/bs';
import { FcSearch } from 'react-icons/fc';
import { ImCancelCircle } from 'react-icons/im';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const usertype = localStorage.getItem('userType');
  const username = localStorage.getItem('username');
  const { logout, cartCount } = useContext(GeneralContext);

  const [productSearch, setProductSearch] = useState('');
  const [noResult, setNoResult] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const onChange = (e) => {
    const userInput = e.target.value;
    setProductSearch(userInput);

    if (!userInput.trim()) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setNoResult(false);
      return;
    }

    const filtered = categories.filter((cat) =>
      cat.toLowerCase().includes(userInput.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
    setNoResult(filtered.length === 0);
  };

  const onClickSuggestion = (suggestion) => {
    setProductSearch(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setNoResult(false);
    navigate(`/category/${suggestion}`);
  };

  const handleSearch = () => {
    const matchedCategory = categories.find(
      (cat) => cat.toLowerCase() === productSearch.toLowerCase()
    );

    if (matchedCategory) {
      setNoResult(false);
      navigate(`/category/${matchedCategory}`);
    } else {
      setNoResult(true);
      setShowSuggestions(false);
    }
  };

  const renderSearchBar = () => (
    <div className="nav-search" style={{ position: 'relative' }}>
      <input
        type="text"
        name="nav-search"
        id="nav-search"
        placeholder="Search Restaurants, cuisine, etc."
        value={productSearch}
        onChange={onChange}
        autoComplete="off"
      />
      <FcSearch
        className="nav-search-icon"
        onClick={handleSearch}
        style={{ cursor: 'pointer' }}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          className="suggestions-list"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '0 0 4px 4px',
            maxHeight: '150px',
            overflowY: 'auto',
            backgroundColor: '#fff',
            position: 'absolute',
            width: '100%',
            zIndex: 10,
            top: '100%',
            left: 0,
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => onClickSuggestion(suggestion)}
              style={{ padding: '0.3rem 0.5rem', cursor: 'pointer' }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {noResult && (
        <div
          className="search-result-data"
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            position: 'absolute',
            width: '100%',
            zIndex: 10,
            top: '100%',
            left: 0,
          }}
        >
          No items found... try searching for Biriyani, Pizza, etc.
          <ImCancelCircle
            className="search-result-data-close-btn"
            onClick={() => {
              setNoResult(false);
              setProductSearch('');
              setFilteredSuggestions([]);
              setShowSuggestions(false);
            }}
            style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
          />
        </div>
      )}
    </div>
  );

  if (!usertype) {
    return (
      <div className="navbar">
        <h3 onClick={() => navigate('')}>SB Foods</h3>
        <div className="nav-content">
          {renderSearchBar()}
          <button className="btn btn-outline-primary" onClick={() => navigate('/auth')}>
            Login
          </button>
        </div>
      </div>
    );
  }

  if (usertype === 'customer') {
    return (
      <div className="navbar">
        <h3 onClick={() => navigate('')}>SB Foods</h3>
        <div className="nav-content">
          {renderSearchBar()}
          <div className="nav-content-icons">
            <div className="nav-profile" onClick={() => navigate('/profile')}>
              <BsPersonCircle
                className="navbar-icons"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Profile"
              />
              <p>{username}</p>
            </div>
            <div className="nav-cart" onClick={() => navigate('/cart')}>
              <BsCart3
                className="navbar-icons"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Cart"
              />
              <div className="cart-count">{cartCount}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (usertype === 'admin') {
    return (
      <div className="navbar-admin">
        <h3 onClick={() => navigate('/admin')}>SB Foods (admin)</h3>
        <ul>
          <li onClick={() => navigate('/admin')}>Home</li>
          <li onClick={() => navigate('/all-users')}>Users</li>
          <li onClick={() => navigate('/all-orders')}>Orders</li>
          <li onClick={() => navigate('/all-restaurants')}>Restaurants</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>
    );
  }

  if (usertype === 'restaurant') {
    return (
      <div className="navbar-admin">
        <h3 onClick={() => navigate('/restaurant')}>SB Foods (Restaurant)</h3>
        <ul>
          <li onClick={() => navigate('/restaurant')}>Home</li>
          <li onClick={() => navigate('/restaurant-orders')}>Orders</li>
          <li onClick={() => navigate('/restaurant-menu')}>Menu</li>
          <li onClick={() => navigate('/new-product')}>New Item</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>
    );
  }

  return null;
};

export default Navbar;
