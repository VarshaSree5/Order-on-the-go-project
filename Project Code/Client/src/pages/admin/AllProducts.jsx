import React from 'react';
import '../../styles/AllProducts.css';

const AllProducts = () => {
  return (
    <div className="all-products-page">
      <div className="all-products-container">

        {/* Filter Section */}
        <div className="all-products-filter">
          <h4>Filters</h4>
          <div className="all-product-filters-body">

            {/* Sort Filter */}
            <div className="all-product-filter-sort">
              <h6>Sort</h6>
              <div className="all-product-filter-sort-body all-product-sub-filter-body">
                {['Popular', 'Price (low to high)', 'Price (high to low)', 'Discount'].map((label, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sortRadio"
                      id={`filter-sort-radio${idx + 1}`}
                    />
                    <label className="form-check-label" htmlFor={`filter-sort-radio${idx + 1}`}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="all-product-filter-categories">
              <h6>Categories</h6>
              <div className="all-product-filter-categories-body all-product-sub-filter-body">
                {[
                  'Birthday Gifts',
                  'Anniversary Gifts',
                  'Cakes',
                  'Chocolates',
                  'Flowers',
                  'Valentine\'s Day Gifts'
                ].map((label, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`filter-category-check-${idx + 1}`}
                    />
                    <label className="form-check-label" htmlFor={`filter-category-check-${idx + 1}`}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="all-product-filter-gender">
              <h6>Gender</h6>
              <div className="all-product-filter-gender-body all-product-sub-filter-body">
                {['Men', 'Women', 'Unisex'].map((label, idx) => (
                  <div className="form-check" key={idx}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`filter-gender-check-${idx + 1}`}
                    />
                    <label className="form-check-label" htmlFor={`filter-gender-check-${idx + 1}`}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Product Section */}
        <div className="all-products-body">
          <h3>All Products</h3>
          <div className="all-products">

            {[...Array(5)].map((_, idx) => (
              <div className="all-product-item" key={idx}>
                <div className="all-product">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGnbY9YlH663xUNGHOe0lS9n-zSwrLtiEFVw&usqp=CAU"
                    alt="Gift Product"
                  />
                  <div className="all-product-data">
                    <h6>Product Title</h6>
                    <p>Description about product</p>
                    <h5>
                      ₹499 <s>₹799</s> <span>(30% off)</span>
                    </h5>
                  </div>
                  <button>Update</button>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AllProducts;
