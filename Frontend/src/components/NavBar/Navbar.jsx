import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import LogoutPopup from '../LogoutPopup/LogoutPopup';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount, token, setToken, food_list, url, setSearchTerm, searchTerm } = useContext(StoreContext);
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const searchContainerRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
        setShowLogoutConfirm(false);
        navigate("/");
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        if (query.length > 0) {
            const filteredSuggestions = food_list.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestionName) => {
        setSearchTerm(suggestionName);
        setSuggestions([]);
        setShowSearch(false);
        navigate('/');
        setTimeout(() => {
            document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };
    
    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            setSuggestions([]);
            setShowSearch(false);
            navigate('/');
            setTimeout(() => {
                document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchContainerRef]);


    return (
        <>
            {showLogoutConfirm &&
                <LogoutPopup
                    onConfirm={handleLogout}
                    onCancel={() => setShowLogoutConfirm(false)}
                />
            }
            <div className='navbar'>
                <Link to='/'><img src={assets.logo} alt='logo' className='logo' /></Link>
                <ul className="navbar-menu">
                    <Link to='/' className={menu === "home" ? "active" : ""} onClick={() => setMenu("home")}>home</Link>
                    <a href='#explore-menu' className={menu === "menu" ? "active" : ""} onClick={() => setMenu("menu")}>menu</a>
                    <a href='#app-download' className={menu === "mobile-app" ? "active" : ""} onClick={() => setMenu("mobile-app")}>mobile-app</a>
                    <a href='#footer' className={menu === "contact us" ? "active" : ""} onClick={() => setMenu("contact us")}>contact us</a>
                </ul>
                <div className="navbar-right">
                    <div className="navbar-search-container" ref={searchContainerRef}>
                        <img src={assets.search_icon} alt="search" onClick={() => setShowSearch(!showSearch)} className="search-icon"/>
                        <input
                            type="text"
                            value={searchTerm}
                            className={`search-input ${showSearch ? 'active' : ''}`}
                            placeholder="Search your favorite food..."
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchSubmit}
                        />
                        {suggestions.length > 0 && (
                             <div className="search-suggestions-dropdown">
                                {suggestions.map((item) => (
                                    <div key={item._id} className="suggestion-item" onClick={() => handleSuggestionClick(item.name)}>
                                        <img src={url+"/images/"+item.image} alt={item.name} className="suggestion-image" />
                                        <p className="suggestion-name">{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="navbar-search-icon">
                        <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                        <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                    </div>
                    {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
                        : <div className='navbar-profile'>
                            <img src={assets.profile_icon} alt="" />
                            <ul className="nav-profile-dropdown">
                                <li onClick={() => navigate('/myorders')}>
                                    <img src={assets.bag_icon} alt="" />
                                    <p>Orders</p>
                                </li>
                                <hr />
                                <li onClick={() => setShowLogoutConfirm(true)}>
                                    <img src={assets.logout_icon} alt="" />
                                    <p>Logout</p>
                                </li>
                            </ul>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default Navbar;

