import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';


const Navbar = ({ setIsLoggedIn }) => {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


    const handleLogout = () => {
        sessionStorage.removeItem('isAdminLoggedIn');
        setIsLoggedIn(false);
    };

    return (
        <> 
            <div className='navbar'>
                <Link to='/'><img src={assets.logo} alt='logo' className='logo' /></Link>
                <div className='navbar-profile'>
                    <img src={assets.profile_icon} alt="profile" />
                    <ul className="nav-profile-dropdown">
                        <li onClick={handleLogout}>
                            <img src={assets.logout_icon} alt="logout" />
                            <p>Logout</p>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;