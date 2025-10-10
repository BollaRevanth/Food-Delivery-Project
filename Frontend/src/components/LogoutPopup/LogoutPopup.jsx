import React from 'react';
import './LogoutPopup.css';

const LogoutPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className='logout-popup-overlay'>
      <div className='logout-popup-content'>
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className='logout-popup-buttons'>
          <button onClick={onCancel} className='btn-cancel'>Cancel</button>
          <button onClick={onConfirm} className='btn-confirm'>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;