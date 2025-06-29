import React from 'react';
import '../styles/Restaurants.css';

const Restaurants = () => {
  return (
    <div className="restaurants-container">

      {/* Filters Section */}
      <div className="restaurants-filter">
        <h4>Filters</h4>
        <div className="restaurant-filters-body">

          <div className="filter-sort">
            <h6>Sort By</h6>
            <div className="filter-sort-body sub-filter-body">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="filter-sort-radio1"
                />
                <label className="form-check-label" htmlFor="filter-sort-radio1">
                  Popularity
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="filter-sort-radio4"
                />
                <label className="form-check-label" htmlFor="filter-sort-radio4">
                  Rating
                </label>
              </div>
            </div>
          </div>

          <div className="filter-categories">
            <h6>Categories</h6>
            <div className="filter-categories-body sub-filter-body">
              {[
                'South Indian',
                'North Indian',
                'Chinese',
                'Beverages',
                'Ice Cream',
                'Tiffins'
              ].map((category, idx) => (
                <div className="form-check" key={category}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id={`filter-category-check-${idx}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`filter-category-check-${idx}`}
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Restaurant List Section */}
      <div className="restaurants-body">
        <h3>All restaurants</h3>
        <div className="restaurants">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="restaurant-item" key={index}>
              <div className="restaurant">
                <img
                  src="https://odhi.in/image/cache/catalog/eat/chicken-biryani-odhi-in-eat-online-coimbatore-1000x1000.jpg"
                  alt="Biryani Dish"
                />
                <div className="restaurant-data">
                  <h6>Product title</h6>
                  <p>Description about product</p>
                  <h5>
                    Rating: <b>3.6/5</b>
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Restaurants;
