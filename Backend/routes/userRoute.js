import express from "express"
import { loginUser,registerUser,googleLogin,githubLogin } from "../controllers/userController.js"


const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/google-login",googleLogin)
userRouter.post("/github-login",githubLogin)

export default userRouter;