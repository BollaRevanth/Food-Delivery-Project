import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'



//placing user order from frontend
const placeOrder = async (req,res)=>{

    const frontend_url = "https://food-delivery-frontend-h8j6.onrender.com/"

    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        res.json({ success:true,message:"Order Placed Successfully" });
        


    } catch (error) {
         console.log("Error in placeOrder:", error);
         res.json({ success: false, message: "Couldn't place the Order. Please try again." });
    }

}

const verifyOrder = async (req,res) =>{
    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndUpdate(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//user orders for frontend
const userOrders = async(req,res) =>{
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


//listing orders for admin panel
const listOrders = async (req,res) =>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:true,message:"Error"})
        
    }
}

//api for updating order status 
const updateStatus = async (req,res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}


export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}
