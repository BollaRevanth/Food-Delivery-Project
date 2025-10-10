import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
    const { food_list, searchTerm } = useContext(StoreContext);

    const filteredFoodList = food_list.filter(item => {
        const categoryMatch = category === "All" || item.category === category;
        const searchMatch = searchTerm === "" || 
                              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.category.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
    });

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {filteredFoodList.map((item) => (
                    <FoodItem
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.image}
                    />
                ))}
            </div>
        </div>
    );
};

export default FoodDisplay;

