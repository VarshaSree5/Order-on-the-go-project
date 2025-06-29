import React, { useContext, useEffect, useState, useCallback } from 'react';
import '../../styles/Cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../../context/GeneralContext';

// Move mockItems OUTSIDE the component so its reference is stable
const mockItems = [
  {
    _id: 'mock1',
    userId: null, // will assign dynamically later
    foodItemName: 'Butter Chicken',
    restaurantName: 'Tandoori Flame',
    foodItemImg: 'https://static01.nyt.com/images/2024/10/29/multimedia/Butter-Chickenrex-tbvz/Butter-Chickenrex-tbvz-mediumSquareAt3X.jpg',
    price: 320,
    discount: 10,
    quantity: 2
  },
  {
    _id: 'mock2',
    userId: null,
    foodItemName: 'Paneer Butter Masala',
    restaurantName: 'Veggie Delight',
    foodItemImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_JfZHtD_jlggLqhDlthd7Jg2o4gt7OrWH7w&s',
    price: 250,
    discount: 5,
    quantity: 1
  }
];

const Cart = () => {
  const [cart, setCart] = useState([]);
  const { fetchCartCount } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Assign userId to mockItems copies to match user
  const mockItemsWithUserId = mockItems.map(item => ({ ...item, userId }));

  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-cart');
      const filtered = response.data.filter(item => item.userId === userId);
      setCart(filtered.length ? filtered : mockItemsWithUserId);
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("Failed to load cart. Showing sample items.");
      setCart(mockItemsWithUserId);
    }
  }, [userId, mockItemsWithUserId]);

  const calculateTotalPrice = useCallback(() => {
    const price = cart.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const discount = cart.reduce((sum, p) => sum + ((p.price * p.discount) / 100) * p.quantity, 0);
    setTotalPrice(price);
    setTotalDiscount(Math.floor(discount));
    setDeliveryCharges(price > 1000 || cart.length === 0 ? 0 : 50);
  }, [cart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    calculateTotalPrice();
  }, [cart, calculateTotalPrice]);

  const removeItem = async (id) => {
    try {
      await axios.put('http://localhost:6001/remove-item', { id });
      await fetchCart();
      fetchCartCount();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const isFormComplete = () => {
    return name && mobile && email && address && pincode && paymentMethod;
  };

  const placeOrder = async () => {
    if (!isFormComplete()) {
      alert("Please fill in all checkout fields.");
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }
    try {
      await axios.post('http://localhost:6001/place-cart-order', {
        userId, name, mobile, email, address, pincode, paymentMethod, orderDate: new Date()
      });
      alert('Order placed successfully!');
      setName(''); setMobile(''); setEmail(''); setAddress(''); setPincode(''); setPaymentMethod('');
      navigate('/profile');
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="cartPage">
      <div className="cartContents">
        {cart.length === 0 && <p>No items in the cart..</p>}
        {cart.map((item) => (
          <div key={item._id} className="cartItem">
            <img src={item.foodItemImg} alt={item.foodItemName} />
            <div className="cartItem-data">
              <h4>{item.foodItemName}</h4>
              <p>{item.restaurantName}</p>
              <div className="cartItem-inputs">
                <div className="cartItem-input">
                  <button className="btn">Quantity: </button>
                  <input type="number" className="form-control quantity-field" value={item.quantity} min="1" disabled />
                </div>
                <h6>
                  Price: ₹{Math.round(item.price - (item.price * item.discount) / 100)} <s>₹{item.price}</s>
                </h6>
              </div>
              <button className="btn btn-outline-danger" onClick={() => removeItem(item._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cartPriceBody">
        <h4>Price Details</h4>
        <span><b>Total MRP: </b> ₹{totalPrice}</span>
        <span><b>Discount: </b><span style={{ color: "green" }}>- ₹{totalDiscount}</span></span>
        <span><b>Delivery Charges: </b><span style={{ color: "red" }}>+ ₹{deliveryCharges}</span></span>
        <hr />
        <h5><b>Final Price: </b> ₹{totalPrice - totalDiscount + deliveryCharges}</h5>
        <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">Place order</button>
      </div>

      {/* Checkout Modal */}
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Checkout</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              {/* Checkout form fields */}
              <div className="checkout-address">
                <h4>Checkout Details</h4>
                {['Name', 'Mobile', 'Email', 'Address', 'Pincode'].map((label, idx) => (
                  <div className="form-floating mb-3" key={idx}>
                    <input type={label === 'Email' ? 'email' : 'text'} className="form-control"
                      value={{Name:name,Mobile:mobile,Email:email,Address:address,Pincode:pincode}[label]}
                      onChange={(e) => {
                        const setter = { Name: setName, Mobile: setMobile, Email: setEmail, Address: setAddress, Pincode: setPincode }[label];
                        setter(e.target.value);
                      }}
                    />
                    <label>{label}</label>
                  </div>
                ))}
              </div>
              <div className="checkout-payment-method">
                <h4>Payment Method</h4>
                <div className="form-floating mb-3">
                  <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="">Choose payment method</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                  <label>Payment Method</label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={placeOrder}>Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
