import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favourite food here</h2>
        <p>Fresh and delicious meals delivered at your doorstep. Skip the cooking and the queues for lunch.
            Your next delicious meal from a top-rated restaurant is just a click away.</p>
        <a href="#explore-menu"><button>View Menu</button></a>
      </div>
    </div>
  )
}

export default Header
