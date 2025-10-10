import React, { useState, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const navigate = useNavigate();
    
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (success === "true") {
            const timerSpinner = setTimeout(() => {
                setShowPopup(true);
                
                const timerRedirect = setTimeout(() => {
                    navigate("/myorders", { replace: true }); 
                }, 2000);

                return () => clearTimeout(timerRedirect);
            }, 3000);

            return () => clearTimeout(timerSpinner);

        } else {
            navigate("/", { replace: true });
        }
    }, [success, navigate]);

    return (
        <div className='verify'>
            {showPopup ? (
                <div className="popup-container">
                    <div className="popup">
                        <div className="popup-icon">
                            <svg xmlns="http://www.w.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <h2>Order Confirmed!</h2>
                        <p>Your order has been placed successfully.</p>
                    </div>
                </div>
            ) : (
                <div className="spinner"></div>
            )}
        </div>
    );
};

export default Verify;

