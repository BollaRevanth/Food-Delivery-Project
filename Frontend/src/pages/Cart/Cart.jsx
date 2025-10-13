import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, promoCode, setPromoCode, discount, applyPromoCode, promoMessage, setPromoMessage, token, setShowLogin } = useContext(StoreContext);
  const navigate = useNavigate();

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + deliveryFee;

  const handlePromoSubmit = () => {
    if (promoCode.trim() === "") {
        setPromoMessage("Please enter a promo code.");
        return;
    }
    applyPromoCode(promoCode);
  }

  const handleCheckout = () => {
    if (!token) {
        setShowLogin(true);
    } else {
        navigate('/order');
    }
  }

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>Remove</p>
                </div>
                <hr />
              </div>
            )
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <hr />
            {discount > 0 && (
                <>
                    <div className="cart-total-details discount">
                        <p>Discount</p>
                        <p>- ${discountAmount.toFixed(2)}</p>
                    </div>
                    <hr />
                </>
            )}
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${total.toFixed(2)}</b>
            </div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promo code' value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <button onClick={handlePromoSubmit}>Submit</button>
            </div>
            {promoMessage && <p className={`promo-message ${discount > 0 ? 'success' : 'error'}`}>{promoMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;
