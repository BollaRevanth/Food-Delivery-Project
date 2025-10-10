import React, { useState } from 'react';
import './Login.css';
import { assets } from '../../assets/assets'; 

const Login = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    
    const ADMIN_EMAIL = "revcodes@foodel.com";
    const ADMIN_PASSWORD = "password1234";

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            
            setError('');
            setIsLoggedIn(true);
           
            sessionStorage.setItem('isAdminLoggedIn', 'true');
        } else {
            
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className='login-container'>
            <form className='login-form' onSubmit={handleLogin}>
                <img src={assets.logo} alt="Foodel Logo" className='login-logo' />
                <h2>Admin Panel Login</h2>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type='submit'>Login</button>
                {error && <p className='login-error'>{error}</p>}
            </form>
        </div>
    );
};

export default Login;