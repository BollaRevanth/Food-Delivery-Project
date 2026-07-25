import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import { OAuth2Client } from 'google-auth-library'
import axios from 'axios'


//login user
const loginUser = async(req,res)=>{
    const {email,password} = req.body; // email field here can be email OR name/username
    try {
        // Query by either email or username (name)
        const user = await userModel.findOne({
            $or: [
                { email: email },
                { name: email }
            ]
        });

        if(!user){
            return res.json({success:false,message:"User doesn't exist"})
        }

        // OAuth users without a password cannot login via traditional form until they set one
        if (!user.password) {
            return res.json({success:false,message:"Please sign in using Google or GitHub"})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if (!isMatch) {
            return res.json({success:false,message:"Invalid credentials"})
        }

        const token = createToken(user._id);
        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}

const createToken = (id) =>{
    console.log('Creating token with payload:',{id});
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async(req,res) => {
    const {name,password,email,googleId,githubId} = req.body;
    try {
        // Check if email already exists
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false,message:"User already exists with this email"})
        }

        // Check if username already exists
        const usernameExists = await userModel.findOne({ name });
        if (usernameExists) {
            return res.json({success:false,message:"Username is already taken"})
        }

        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please enter a valid email"})
        }

        if (password.length<8) {
            return res.json({success:false,message:"Please enter a strong password"})
            
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword,
            googleId: googleId || undefined,
            githubId: githubId || undefined
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token});


    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Google OAuth Login
const googleLogin = async (req, res) => {
    const { credential } = req.body;
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        // Verify the ID token sent from the client
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        // Find the user
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ 
                success: false, 
                code: "USER_NOT_FOUND", 
                message: "User doesn't exist",
                email,
                name,
                googleId
            });
        }
        
        if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Google authentication failed" });
    }
};

// GitHub OAuth Login
const githubLogin = async (req, res) => {
    const { code } = req.body;
    try {
        // Exchange authorization code for an Access Token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            { headers: { Accept: 'application/json' } }
        );

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
            return res.json({ success: false, message: "Failed to exchange GitHub authorization code" });
        }

        // Fetch User Profile
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Fetch User Emails
        const emailsResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const primaryEmailObj = emailsResponse.data.find(email => email.primary);
        const email = primaryEmailObj ? primaryEmailObj.email : `${userResponse.data.login}@github.com`;
        const name = userResponse.data.name || userResponse.data.login;
        const githubId = userResponse.data.id.toString();

        // Find user
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ 
                success: false, 
                code: "USER_NOT_FOUND", 
                message: "User doesn't exist",
                email,
                name,
                githubId
            });
        }
        
        if (!user.githubId) {
            user.githubId = githubId;
            await user.save();
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "GitHub authentication failed" });
    }
};

export { loginUser, registerUser, googleLogin, githubLogin }