import express from "express";
import { addFood, listFood, removeFood, getFoodById, updateFood } from "../controllers/FoodController.js";
import multer from "multer";

const FoodRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });


FoodRouter.post("/add", upload.single("image"), addFood);
FoodRouter.get("/list", listFood);
FoodRouter.post("/remove", removeFood);


FoodRouter.get("/:id", getFoodById);


FoodRouter.post("/update", upload.single("image"), updateFood);


export default FoodRouter;