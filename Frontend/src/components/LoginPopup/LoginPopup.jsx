import React, { useContext, useState, useEffect, useRef } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken, mergeGuestCart, loadCartData, loginPopupState: currState, setLoginPopupState: setCurrState, socialData, setSocialData } = useContext(StoreContext);
    const containerRef = useRef(null);
    const [googleBtnWidth, setGoogleBtnWidth] = useState(340);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const updateWidth = () => {
            if (containerRef.current) {
                const width = containerRef.current.getBoundingClientRect().width;
                if (width > 0) {
                    const clampedWidth = Math.max(200, Math.min(400, Math.floor(width)));
                    setGoogleBtnWidth(clampedWidth);
                }
            }
        };

        updateWidth();

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                if (width > 0) {
                    const clampedWidth = Math.max(200, Math.min(400, Math.floor(width)));
                    setGoogleBtnWidth(clampedWidth);
                }
            }
        });
        
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(url + "/api/user/google-login", {
                credential: credentialResponse.credential
            });
            if (response.data.success) {
                const userToken = response.data.token;
                localStorage.setItem("token", userToken);
                setToken(userToken);
                
                await mergeGuestCart(userToken);
                await loadCartData(userToken);
                
                setShowLogin(false);
            } else if (response.data.code === "USER_NOT_FOUND") {
                if (currState === "Login") {
                    toast.error("Account does not exist. Please sign up using the Sign Up page.");
                } else {
                    setSocialData({
                        email: response.data.email,
                        name: response.data.name || "",
                        googleId: response.data.googleId
                    });
                    setData(d => ({
                        ...d,
                        email: response.data.email,
                        name: response.data.name || ""
                    }));
                    setCurrState("Complete Registration");
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Google login failed");
        }
    };

    const handleGoogleError = () => {
        toast.error("Google Sign-In was unsuccessful. Try again later.");
    };

    const handleGitHubLogin = () => {
        localStorage.setItem("oauth_state", currState);
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id_placeholder';
        const redirectUri = window.location.origin;
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    };

    const handleClose = () => {
        setShowLogin(false);
        setCurrState("Login");
        setSocialData(null);
    };

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if (currState === 'Login') {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        try {
            const payload = {
                ...data,
                googleId: socialData?.googleId || undefined,
                githubId: socialData?.githubId || undefined
            };
            const response = await axios.post(newUrl, payload);
            if (response.data.success) {
                const userToken = response.data.token;
                localStorage.setItem("token", userToken);
                setToken(userToken);
                
                await mergeGuestCart(userToken);
                await loadCartData(userToken);
                
                handleClose();
                toast.success(currState === "Login" ? "Logged in successfully!" : "Account created successfully!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during authentication.");
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={handleClose} src={assets.cross_icon} alt="close" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Complete Registration" ? (
                        <>
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Username' required />
                            <input name='email' value={data.email} type="text" placeholder='Your email' disabled />
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Create password (min 8 characters)' required />
                        </>
                    ) : (
                        <>
                            {currState === "Sign Up" && <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Username' required />}
                            <input name='email' onChange={onChangeHandler} value={data.email} type={currState === "Login" ? "text" : "email"} placeholder={currState === "Login" ? "Email or Username" : "Your email"} required />
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                        </>
                    )}
                </div>
                <button type='submit'>
                    {currState === "Complete Registration" ? "Create account" : (currState === "Sign Up" ? "Create account" : "Login")}
                </button>
                
                {currState !== "Complete Registration" && (
                    <>
                        <div className="login-popup-divider">
                            <span>or</span>
                        </div>

                        <div ref={containerRef} className="social-login-container">
                            <div className="google-btn-wrapper">
                                <GoogleLogin 
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    text={currState === "Sign Up" ? "signup_with" : "signin_with"}
                                    shape="rectangular"
                                    width={String(googleBtnWidth)}
                                />
                            </div>
                            <button type="button" onClick={handleGitHubLogin} className="github-login-btn">
                                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" className="github-icon" />
                                <span>{currState === "Sign Up" ? "Sign up with GitHub" : "Sign in with GitHub"}</span>
                            </button>
                        </div>
                    </>
                )}

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
                {currState === "Complete Registration" ? (
                    <p>Registering with social account. <span onClick={handleClose}>Cancel</span></p>
                ) : (
                    currState === "Login"
                        ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                        : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
