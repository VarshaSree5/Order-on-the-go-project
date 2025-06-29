import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import '../../styles/CategoryProducts.css';

const CategoryProducts = () => {
  const navigate = useNavigate();
  const { category } = useParams();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const response = {
        data: [
          {
            _id: "r1",
            title: "Sunrise Breakfast Hub",
            address: "12 Morning St",
            mainImg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
            menu: [
              {
                _id: "m1",
                name: "Pancakes with Syrup",
                category: "Breakfast",
                price: 5.99,
                images: ["https://hips.hearstapps.com/delish/assets/16/17/1461616265-pancakes.jpg"]
              },
              {
                _id: "m2",
                name: "Classic Omelette",
                category: "Breakfast",
                price: 4.50,
                images: ["https://www.thespruceeats.com/thmb/NsRjeysNDU4jrmNLlKBvtmAcYxo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/classic-french-omelet-recipe-1375522-hero-01-da0b2c6b285642038d0f0323adcf26b5.jpg"]
              }
            ]
          },
          {
            _id: "r2",
            title: "Biryani Bliss",
            address: "88 Spicy Lane",
            mainImg: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
            menu: [
              {
                _id: "m3",
                name: "Chicken Biryani",
                category: "Biriyani",
                price: 12.99,
                images: ["https://bigbrothersdhaba.com/wp-content/uploads/2023/07/chicken-hyderabadi-biryani-01.jpg"]
              },
              {
                _id: "m4",
                name: "Veg Biryani",
                category: "Biriyani",
                price: 10.50,
                images: ["https://static.wixstatic.com/media/91e241_0cf76aa5613b4055be2f922f71edeaa0~mv2.jpg/v1/fill/w_560,h_372,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Ustaadi%20Hyderabadi%20Veg%20Biryani.jpg"]
              }
            ]
          },
          {
            _id: "r3",
            title: "Cheesy Pizza Point",
            address: "456 Pizza Ave",
            mainImg: "https://images.unsplash.com/photo-1548365328-00e287e2a514?auto=format&fit=crop&w=800&q=80",
            menu: [
              {
                _id: "m5",
                name: "Margherita Pizza",
                category: "Pizza",
                price: 8.99,
                images: ["https://www.vegrecipesofindia.com/wp-content/uploads/2020/12/margherita-pizza-4.jpg"]
              },
              {
                _id: "m6",
                name: "Pepperoni Pizza",
                category: "Pizza",
                price: 9.99,
                images: ["https://www.thehealthfactory.in/cdn/shop/articles/Pepperoni_Pizza_with_Zero_Maida_Pizza_Base_216262f8-876e-4953-9fdc-4a337a772a26.webp?v=1747650715"]
              }
            ]
          },
          {
            _id: "r4",
            title: "Wok n' Roll Noodles",
            address: "99 Asian St",
            mainImg: "https://images.unsplash.com/photo-1564518098555-2f6d47e53717?auto=format&fit=crop&w=800&q=80",
            menu: [
              {
                _id: "m7",
                name: "Hakka Noodles",
                category: "Noodles",
                price: 7.50,
                images: ["https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/hakka-noodles-recipe.jpg"]
              },
              {
                _id: "m8",
                name: "Schezwan Noodles",
                category: "Noodles",
                price: 8.50,
                images: ["https://i.ytimg.com/vi/4Fs9L_fArHM/maxresdefault.jpg"]
              }
            ]
          },
          {
            _id: "r5",
            title: "Burger Barn",
            address: "77 Fastfood Blvd",
            mainImg: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
            menu: [
              {
                _id: "m9",
                name: "Cheese Burger",
                category: "Burger",
                price: 6.50,
                images: ["https://www.kitchensanctuary.com/wp-content/uploads/2021/05/Double-Cheeseburger-square-FS-42.jpg"]
              },
              {
                _id: "m10",
                name: "Chicken Burger",
                category: "Burger",
                price: 7.00,
                images: ["https://www.recipetineats.com/tachyon/2023/09/Crispy-fried-chicken-burgers_5.jpg"]
              }
            ]
          }
        ]
      };

      const matchedItems = [];

      response.data.forEach((restaurant) => {
        restaurant.menu?.forEach((item) => {
          if (item.category?.toLowerCase() === category.toLowerCase()) {
            matchedItems.push({
              ...item,
              restaurantId: restaurant._id,
              restaurantName: restaurant.title
            });
          }
        });
      });

      setMenuItems(matchedItems);
      setLoading(false);
    } catch (err) {
      setError("Failed to load menu items.");
      setLoading(false);
    }
  }, [category]);

  if (loading) {
    return (
      <div className="categoryProducts-page" style={{ textAlign: "center", paddingTop: "5vh" }}>
        <img src="/spinner.svg" alt="Loading..." width="60" height="60" />
      </div>
    );
  }

  return (
    <div className="categoryProducts-page">
      <h2>Menu Items in Category: {category}</h2>

      {error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : menuItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>No menu items found in this category.</p>
      ) : (
        <div className="menu-items-container">
          <div
            className="menu-items-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
              padding: '20px',
            }}
          >
            {menuItems.map((item) => (
              <div
                className="menu-item-card"
                key={item._id}
                onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
                title={`From ${item.restaurantName}`}
                style={{
                  cursor: "pointer",
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  backgroundColor: '#fff',
                }}
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: "8px 8px 0 0",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-food.png";
                  }}
                />
                <div className="menu-item-info" style={{ padding: '10px' }}>
                  <h5 style={{ margin: '0 0 8px' }}>{item.name}</h5>
                  <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>
                    Price: ${item.price.toFixed(2)}
                  </p>
                  <small style={{ color: '#555' }}>
                    Restaurant: {item.restaurantName}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CategoryProducts;
