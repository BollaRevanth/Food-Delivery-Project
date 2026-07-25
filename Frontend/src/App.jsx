import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Cart from './pages/Cart/Cart.jsx';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder.jsx';
import Footer from './components/Footer/Footer.jsx';
import LoginPopup from './components/LoginPopup/LoginPopup.jsx';
import Verify from './pages/Verify/Verify.jsx';
import MyOrders from './pages/MyOrders/MyOrders.jsx';
import { StoreContext } from './context/StoreContext.jsx';
import CartPopup from './components/CartPopup/CartPopup.jsx';

const App = () => {
  const { showLogin, setShowLogin, url, setToken, mergeGuestCart, loadCartData, setLoginPopupState, setSocialData } = useContext(StoreContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Clean query parameters from URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const loginGitHubUser = async () => {
        try {
          const oauthState = localStorage.getItem("oauth_state") || "Login";
          localStorage.removeItem("oauth_state");

          const response = await axios.post(url + "/api/user/github-login", { code });
          if (response.data.success) {
            const userToken = response.data.token;
            localStorage.setItem("token", userToken);
            setToken(userToken);
            
            await mergeGuestCart(userToken);
            await loadCartData(userToken);
            toast.success("Logged in successfully with GitHub!");
          } else if (response.data.code === "USER_NOT_FOUND") {
            if (oauthState === "Login") {
              toast.error("Account does not exist. Please sign up using the Sign Up page.");
            } else {
              setSocialData({
                email: response.data.email,
                name: response.data.name || "",
                githubId: response.data.githubId
              });
              setLoginPopupState("Complete Registration");
              setShowLogin(true);
              toast.info("Please complete your registration details.");
            }
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error(error);
          toast.error("GitHub login failed.");
        }
      };
      
      loginGitHubUser();
    }
  }, [url, setToken, mergeGuestCart, loadCartData, setLoginPopupState, setSocialData]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <CartPopup />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <NavBar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;

