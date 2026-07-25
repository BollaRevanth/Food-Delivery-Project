import React, { useContext, useEffect } from 'react';
import './CartPopup.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const CartPopup = () => {
    const { lastAddedItem, showCartPopup, setShowCartPopup, url } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (showCartPopup) {
            const timer = setTimeout(() => {
                setShowCartPopup(false);
            }, 5000); // Auto close after 5 seconds

            return () => clearTimeout(timer);
        }
    }, [showCartPopup, lastAddedItem, setShowCartPopup]);

    const handleViewCart = () => {
        setShowCartPopup(false);
        navigate('/cart');
    };

    if (!lastAddedItem) return null;

    return (
        <div className={`cart-popup-wrapper ${showCartPopup ? 'show' : ''}`}>
            <div className="cart-popup-container">
                <div className="cart-popup-info">
                    <img src={url + "/images/" + lastAddedItem.image} alt={lastAddedItem.name} className="cart-popup-img" />
                    <div className="cart-popup-details">
                        <span className="cart-popup-added">Added to Cart!</span>
                        <span className="cart-popup-name">{lastAddedItem.name}</span>
                        <span className="cart-popup-price">${lastAddedItem.price}</span>
                    </div>
                </div>
                <div className="cart-popup-actions">
                    <button className="cart-popup-btn" onClick={handleViewCart}>View Cart</button>
                    <button className="cart-popup-close" onClick={() => setShowCartPopup(false)}>×</button>
                </div>
            </div>
        </div>
    );
};

export default CartPopup;
