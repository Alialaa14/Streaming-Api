import { Router } from "express";
import { register , login , logout , resetPassword , sendOtp , updateProfile, verifyAccount, verifyOtp , sendOtpVerification } from "../controler/user.controler.js";
import {isAuthenticated} from "../middleware/isAuthenticated.js"
import uploadPfPic from "../utils/upload_ProfilePic.js";
const userRouter = Router();

userRouter
.post("/register" , uploadPfPic.single("pf-image") ,  register)
.post ("/login" , login)
.post ("/logout" , logout)
.post ("/send-otp" , sendOtp)
.post("/verify-otp" , verifyOtp)
.post ("/reset-password" , resetPassword)
.patch ("/update-profile" ,isAuthenticated , uploadPfPic.single("pf-image") ,  updateProfile)
.post("/verificationOtp" , isAuthenticated , sendOtpVerification)
.post("/verify-account" , isAuthenticated , verifyAccount)


export default userRouter