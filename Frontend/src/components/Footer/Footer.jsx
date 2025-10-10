import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    
                    <a href="#">
                    <img src={assets.footer} alt="Foodel Logo" className="footer-logo-image" />
                    </a>
                    <p className="footer-description-text">
                        Discover a world of flavor without leaving your home. Experience the best dishes your city has to offer, delivered for you. We don't list every restaurant, we partner exclusively with the most beloved and highest-rated kitchens. 
                    </p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="Facebook" />
                        <img src={assets.twitter_icon} alt="Twitter" />
                        <img src={assets.linkedin_icon} alt="LinkedIn" />
                    </div>
                </div>

                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li ><a href="#">Home</a></li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                <div className="footer-content-right">
                    <h2>CONTACT US</h2>
                    <ul>
                        <li>+91-121-912-2425</li>
                        <li>contact@foodel.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright © 2025 Foodel.com - All Rights Reserved.</p>
        </div>
    );
}

export default Footer;