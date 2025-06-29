import React, { useEffect, useState, useCallback } from 'react';
import '../../styles/NewProducts.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = localStorage.getItem('userId');

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMainImg, setProductMainImg] = useState('');
  const [productMenuCategory, setProductMenuCategory] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productNewCategory, setProductNewCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);

  const [availableCategories, setAvailableCategories] = useState([]);
  const [restaurant, setRestaurant] = useState();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-categories');
      setAvailableCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchRestaurant = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-restaurant-details/${userId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Failed to fetch restaurant details:', error);
    }
  }, [userId]);

  const fetchItem = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-item-details/${id}`);
      const data = response.data;
      setProductName(data.title);
      setProductDescription(data.description);
      setProductMainImg(data.itemImg);
      setProductCategory(data.category);
      setProductMenuCategory(data.menuCategory);
      setProductPrice(data.price);
      setProductDiscount(data.discount);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchCategories();
    fetchRestaurant();
    fetchItem();
  }, [fetchCategories, fetchRestaurant, fetchItem]);

  const handleUpdateItem = async () => {
    try {
      await axios.put(`http://localhost:6001/update-product/${id}`, {
        restaurantId: restaurant._id,
        productName,
        productDescription,
        productMainImg,
        productCategory,
        productMenuCategory,
        productNewCategory,
        productPrice,
        productDiscount
      });

      alert('Product updated successfully!');
      navigate('/restaurant-menu');
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  return (
    <div className="new-product-page">
      <div className="new-product-container">
        <h3>Update Item</h3>
        <div className="new-product-body">
          <span>
            <div className="form-floating mb-3 span-21">
              <input
                type="text"
                className="form-control"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <label htmlFor="productName">Product name</label>
            </div>
            <div className="form-floating mb-3 span-22">
              <input
                type="text"
                className="form-control"
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
              <label htmlFor="productDescription">Product Description</label>
            </div>
          </span>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="productMainImg"
              value={productMainImg}
              onChange={(e) => setProductMainImg(e.target.value)}
            />
            <label htmlFor="productMainImg">Thumbnail Img URL</label>
          </div>

          <section>
            <h4>Type</h4>
            <span>
              {['Veg', 'Non Veg', 'Beverages'].map((type) => (
                <div className="form-check" key={type}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="productCategory"
                    value={type}
                    id={`radio-${type}`}
                    checked={productCategory === type}
                    onChange={(e) => setProductCategory(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={`radio-${type}`}>
                    {type}
                  </label>
                </div>
              ))}
            </span>
          </section>

          <span>
            <div className="form-floating mb-3 span-3">
              <select
                className="form-select"
                id="productMenuCategory"
                value={productMenuCategory}
                onChange={(e) => setProductMenuCategory(e.target.value)}
              >
                <option value="">Choose Product Category</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="new category">New category</option>
              </select>
              <label htmlFor="productMenuCategory">Category</label>
            </div>

            <div className="form-floating mb-3 span-3">
              <input
                type="number"
                className="form-control"
                id="productPrice"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
              <label htmlFor="productPrice">Price</label>
            </div>

            <div className="form-floating mb-3 span-3">
              <input
                type="number"
                className="form-control"
                id="productDiscount"
                value={productDiscount}
                onChange={(e) => setProductDiscount(e.target.value)}
              />
              <label htmlFor="productDiscount">Discount (%)</label>
            </div>
          </span>

          {productMenuCategory === 'new category' && (
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="productNewCategory"
                value={productNewCategory}
                onChange={(e) => setProductNewCategory(e.target.value)}
              />
              <label htmlFor="productNewCategory">New Category</label>
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={handleUpdateItem}>
          Update
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
