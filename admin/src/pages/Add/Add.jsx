import React, { useState, useEffect } from 'react'; 
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const Add = ({ url }) => {
    const [searchParams] = useSearchParams();
    const foodId = searchParams.get('id');
    const isEditing = Boolean(foodId);
    
    const [existingImageUrl, setExistingImageUrl] = useState('');

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        
        if (image) {
            formData.append("image", image);
        }

        let response;
        if (isEditing) {
            formData.append("id", foodId); 
            response = await axios.post(`${url}/api/food/update`, formData);
        } else {
            response = await axios.post(`${url}/api/food/add`, formData);
        }

        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: "Salad"
            });
            setImage(false);
            setExistingImageUrl(''); 
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    };

    useEffect(() => {
        if (isEditing) {
            const fetchFoodData = async () => {
                const response = await axios.get(`${url}/api/food/${foodId}`);
                if (response.data.success) {
                    const foodData = response.data.data;
                    setData({
                        name: foodData.name,
                        description: foodData.description,
                        price: foodData.price,
                        category: foodData.category,
                    });
                    setExistingImageUrl(`${url}/images/${foodData.image}`);
                } else {
                    toast.error("Failed to fetch item data.");
                }
            };
            fetchFoodData();
        }
    }, [foodId, isEditing, url]);

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-image-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor='image'>
                        <img 
                            src={image ? URL.createObjectURL(image) : (existingImageUrl || assets.upload_area)} 
                            alt="" 
                        />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
                </div>
                <div className="add-product-name">
                    <p>Product name</p>
                    <input onChange={onChangeHandler} value={data.name} type='text' name='name' placeholder='Type here' required />
                </div>
                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name='description' rows='6' placeholder='Write content here ' required></textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select onChange={onChangeHandler} value={data.category} name='category'>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input onChange={onChangeHandler} value={data.price} type='Number' name='price' placeholder='$20' required />
                    </div>
                </div>
                <button type='submit' className='add-btn'>
                    {isEditing ? 'UPDATE' : 'ADD'}
                </button>
            </form>
        </div>
    );
};

export default Add;