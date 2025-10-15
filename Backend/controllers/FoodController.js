import foodModel from "../models/FoodModel.js";
import fs from "fs";



const addFood = async(req,res)=> {

    let image_filename = `${req.file.filename}`

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename

    })
    try {
        await food.save();
        res.json({success:true,message:"Food Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }

}


const listFood = async(req,res) =>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


const removeFood = async(req,res) =>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}


const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);
        if (food) {
            res.json({ success: true, data: food });
        } else {
            res.json({ success: false, message: "Food item not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching food item" });
    }
};



const updateFood = async (req, res) => {
    try {
        
        const existingFood = await foodModel.findById(req.body.id);
        if (!existingFood) {
            return res.json({ success: false, message: "Food item not found" });
        }

        let image_filename = existingFood.image;

       
        if (req.file) {
            image_filename = req.file.filename;
            
            fs.unlink(`uploads/${existingFood.image}`, (err) => {
                if (err) {
                    
                    console.log("Error deleting old image:", err);
                }
            });
        }

        
        const updatedFoodData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename
        };

        
        await foodModel.findByIdAndUpdate(req.body.id, updatedFoodData);
        
        res.json({ success: true, message: "Food Item Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating food item" });
    }
};


export {addFood, listFood, removeFood, getFoodById, updateFood}; 