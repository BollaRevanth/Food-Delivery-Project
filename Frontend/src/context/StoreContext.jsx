import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:3000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState("");
    const [showLogin, setShowLogin] = useState(false);

    const addToCart = async (itemId) => {
        const newCartItems = { ...cartItems };
        newCartItems[itemId] = (newCartItems[itemId] || 0) + 1;
        setCartItems(newCartItems);

        if (token) {
            await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
        } else {
            localStorage.setItem('guestCart', JSON.stringify(newCartItems));
        }
    };

    const removeFromCart = async (itemId) => {
        const newCartItems = { ...cartItems };
        if (newCartItems[itemId] > 0) {
            newCartItems[itemId] -= 1;
        }
        setCartItems(newCartItems);

        if (token) {
            await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
        } else {
            localStorage.setItem('guestCart', JSON.stringify(newCartItems));
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(`${url}/api/food/list`);
        setFoodList(response.data.data);
    };

    const loadCartData = async (token) => {
        const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
        setCartItems(response.data.cartData);
    };
    
    const mergeGuestCart = async (userToken) => {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{}');
        if (Object.keys(guestCart).length > 0) {
            for (const itemId in guestCart) {
                const quantity = guestCart[itemId];
                if (quantity > 0) {
                    for (let i = 0; i < quantity; i++) {
                        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token: userToken } });
                    }
                }
            }
            localStorage.removeItem('guestCart');
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            } else {
                const guestCart = localStorage.getItem('guestCart');
                if (guestCart) {
                    setCartItems(JSON.parse(guestCart));
                }
            }
        }
        loadData();
    }, []);

    const clearCart = () => {
        setCartItems({});
    };

    const applyPromoCode = (code) => {
        const validCodes = {
            "DISCOUNT10": 0.10,
            "SAVE20": 0.20,
            "FOODIE": 0.15
        };

        if (validCodes[code]) {
            setDiscount(validCodes[code]);
            setPromoMessage("Promo code applied successfully!");
        } else {
            setDiscount(0);
            setPromoMessage("Invalid promo code. Please try again.");
        }
    };

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        clearCart,
        searchTerm,
        setSearchTerm,
        promoCode,
        setPromoCode,
        discount,
        applyPromoCode,
        promoMessage,
        setPromoMessage,
        showLogin,
        setShowLogin,
        mergeGuestCart,
        loadCartData
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
