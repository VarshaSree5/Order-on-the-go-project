import React, { useEffect, useState, useCallback } from 'react';
import '../../styles/NewProducts.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {
  const navigate = useNavigate();
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
  const [restaurant, setRestaurant] = useState(null);

  // ✅ useCallback to prevent ESLint dependency warning
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-categories');
      if (response.data.length > 0 && typeof response.data[0] === 'object') {
        setAvailableCategories(response.data.map((cat) => cat.name));
      } else {
        setAvailableCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchRestaurant = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-restaurant-details/${userId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchCategories();
    fetchRestaurant();
  }, [fetchCategories, fetchRestaurant]);

  const handleNewProduct = async () => {
    const finalCategory =
      productMenuCategory === 'new-category' && productNewCategory
        ? productNewCategory
        : productMenuCategory;

    if (!productName || !productDescription || !productMainImg || !finalCategory || !productCategory) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await axios.post('http://localhost:6001/add-new-product', {
        restaurantId: restaurant._id,
        productName,
        productDescription,
        productMainImg,
        productCategory,
        productMenuCategory: finalCategory,
        productPrice,
        productDiscount,
      });

      alert('Product added successfully!');

      setProductName('');
      setProductDescription('');
      setProductMainImg('');
      setProductCategory('');
      setProductMenuCategory('');
      setProductNewCategory('');
      setProductPrice(0);
      setProductDiscount(0);

      navigate('/restaurant-menu');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Error adding product');
    }
  };

  if (!restaurant) return <div style={{ padding: '20px' }}>Loading restaurant...</div>;

  return (
    <div className="new-product-page">
      <div className="new-product-container">
        <h3>New Product</h3>
        <div className="new-product-body">
          <span>
            <div className="form-floating mb-3 span-21">
              <input
                type="text"
                className="form-control"
                id="productNameInput"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <label htmlFor="productNameInput">Product name</label>
            </div>
            <div className="form-floating mb-3 span-22">
              <input
                type="text"
                className="form-control"
                id="productDescriptionInput"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
              <label htmlFor="productDescriptionInput">Product Description</label>
            </div>
          </span>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="productImgInput"
              value={productMainImg}
              onChange={(e) => setProductMainImg(e.target.value)}
            />
            <label htmlFor="productImgInput">Thumbnail Img URL</label>
          </div>

          <section>
            <h4>Category</h4>
            <span>
              {['Veg', 'Non Veg', 'Beverages'].map((type, index) => (
                <div className="form-check" key={index}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="productCategory"
                    value={type}
                    id={`category-${type}`}
                    checked={productCategory === type}
                    onChange={(e) => setProductCategory(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={`category-${type}`}>
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
                <option value="">Choose Product category</option>
                {availableCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
                <option value="new-category">New category</option>
              </select>
              <label htmlFor="productMenuCategory">Menu Category</label>
            </div>

            <div className="form-floating mb-3 span-3">
              <input
                type="number"
                className="form-control"
                id="productPriceInput"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
              />
              <label htmlFor="productPriceInput">Price</label>
            </div>

            <div className="form-floating mb-3 span-3">
              <input
                type="number"
                className="form-control"
                id="productDiscountInput"
                value={productDiscount}
                onChange={(e) => setProductDiscount(Number(e.target.value))}
              />
              <label htmlFor="productDiscountInput">Discount (in %)</label>
            </div>
          </span>

          {productMenuCategory === 'new-category' && (
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="newCategoryInput"
                value={productNewCategory}
                onChange={(e) => setProductNewCategory(e.target.value)}
              />
              <label htmlFor="newCategoryInput">New Category</label>
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={handleNewProduct}>
          Add product
        </button>
      </div>
    </div>
  );
};

export default NewProduct;
