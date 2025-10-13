import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url, clearCart, discount } = useContext(StoreContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const subtotal = getTotalCartAmount();
    const discountAmount = subtotal * discount;
    const deliveryFee = subtotal > 0 ? 4 : 0;
    const total = subtotal - discountAmount + deliveryFee;

    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id] };
                orderItems.push(itemInfo);
            }
        });
        let orderData = {
            address: data,
            items: orderItems,
            amount: total,
        };
        try {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                clearCart();
                navigate("/verify?success=true");
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            alert("An error occurred while placing the order.");
            console.error(error);
        }
    };

    useEffect(()=>{
      if (!token) {
        navigate('/cart')
      }
      else if(getTotalCartAmount()===0){
        navigate('/cart')
      }
    },[token])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
                    <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
                </div>
                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                <div className="multi-fields">
                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                </div>
                <div className="multi-fields">
                    <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Pin code' />
                    <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                </div>
                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone number' />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Total</h2>
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
                     <div className="payment-option">
                         <div className="radio-button selected"></div>
                          <p>Cash on Delivery 💵</p>
                    </div>
                    <button type='submit' className='checkout-button'>PLACE ORDER</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
