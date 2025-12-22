import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {ENV} from "../utils/ENV.js"
import cloudinary from "../utils/cloudinary.js"
import { sendEmail } from "../utils/sendEmail.js"
import {emailTemplate_PasswordReset , emailTemplate_Verification} from "../utils/emailTemplates.js"
import { customAlphabet } from "nanoid"
import mongoose from "mongoose"
// Register
export const register = async (req , res , next)=>{
  try {
    const {username , email , password} = req.body
    
    const image = req.file

    if (!username || !email || !password) {
      return res.status(400).json({response:false , message : "All fields are required"})
    }

    const user = await User.findOne({email})
    if (user) {
        return res.status(400).json({response:false , message : "User already exists"})
    }
    //handle image Upload
    let result = {public_id : "" , secure_url : ""}
    if (image) { 
       result = await cloudinary.uploader.upload (image.path , {
        folder : "users" , 
        resource_type : "image" , 
        use_filename : true , 
        unique_filename : true , 
        overwrite : true
      })
    }


    // Hash password
    const salt = await bcrypt.genSalt(10)

    const hashedPassword  = await bcrypt.hash(password , salt)

    const newUser = await User.create({
        username , 
        email , 
        password : hashedPassword ,
        profilePic : {
          public_id : result.public_id ,
          secure_url : result.secure_url
        }
    })

    if (!newUser) {
        return res.status(400).json({response:false , message : "User not created"})
    }

    // Genereta token
    const token = jwt.sign({id:newUser._id} , ENV.JWT_SECRET_KEY , {
        expiresIn : "7d" , 
    })
    
    if (!token) {
        return res.status(400).json({response:false , message : "Token not created"})
    }

    res.cookie ("token" , token , {
        httpOnly : true , 
        secure : true , 
        sameSite : "none", 
        maxAge:7 * 24 * 60 * 60 * 1000  // in milliSeconds
    })


    return res.status(200).json({response:true , message : "User created successfully" , user : newUser})

  } catch (error) {
    return next(new Error(error.message))
  }
}
//login 
export const login = async (req , res , next)=>{
    try {
      const {email , password} = req.body

      if (!email || !password) {
        return res.status(400).json({response:false , message : "All fields are required"})
      }

      const user = await User.findOne({email})
      if (!user) {
          return res.status(400).json({response:false , message : "User not found"})
      }

      const isMatch = await bcrypt.compare(password , user.password)

      if (!isMatch){
          return res.status(400).json({response:false , message : "Invalid credentials"})
      }

      const token  = jwt.sign({id:user._id} , ENV.JWT_SECRET_KEY , {
        expiresIn : "7d" , 
      })

      if (!token) {
        return res.status(400).json({response:false , message : "Token not created"})
      }

      res.cookie ("token" , token , {
        httpOnly : true , 
        secure : true , 
        sameSite : "none", 
        maxAge:7 * 24 * 60 * 60 * 1000  // in milliSeconds
      })

      return res.status(200).json({response:true , message : "User logged in successfully" , user : user})
    } catch (error) {
      return next(new Error(error.message))
    }
} 
//logout

export const logout = async (req , res , next)=>{
    try {
      res.clearCookie("token" , {
        httpOnly : true , 
        secure : true , 
        sameSite : "none" , 
        maxAge:7 * 24 * 60 * 60 * 1000
      })

      return res.status(200).json({response:true , message : "User logged out successfully"})
    } catch (error) {
      return next(new Error(error.message))
    }
}
//update profile

export const updateProfile = async (req , res , next)=>{
    try {
      const {username , password}  = req.body
      const image = req.file
      const id = req.user

      if (!username || !password || !image) {
        return res.status(400).json({response:false , message : "All fields are required"})
      }

      if (!id) {
        return res.status(400).json({response:false , message : "User is not authenticated"})
      }

     

      //handle image Upload
      let result = {public_id : "" , secure_url : ""}
      if (image) { 
         result = await cloudinary.uploader.upload (image.path , {
          folder : "users" , 
          resource_type : "image" , 
          use_filename : true , 
          unique_filename : true , 
          overwrite : true
        })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword  = await bcrypt.hash(password , salt)

      const user = await User.findByIdAndUpdate(id , {
        username , 
        password:hashedPassword , 
        profilePic : {
          public_id : result.public_id ,
          secure_url : result.secure_url
        }
      } , {
        new : true , 
      })

      if (!user) {
        return res.status(400).json({response:false , message : "User not updated successfully"})
      }

      return res.status(200).json({response:true , message : "User updated successfully" , user})

    } catch (error) {
      return next(new Error(error.message)) 
    }
}
// Send Otp

export const sendOtp = async (req , res , next)=>{
    try {
      const {email} = req.body

      if (!email) {
        return res.status(400).json({response:false , message : "Email is required"})
      }

      const user = await User.findOne({email})

      if (!user) {
        return res.status(400).json({response:false , message : "User not found"})
      }
      const otp = Math.floor(Math.random() * 9000) + 1000
      sendEmail({to:email , html : emailTemplate_PasswordReset({otp}) })

      user.otp = otp
      user.save()

      //generate Token 

      const token = jwt.sign({id : user.id} , ENV.JWT_SECRET_KEY , {
        expiresIn : "5m"
      })

      if (!token) {
        return res.status(400).json({response:false , message : "Token not created"})
      }

      res.cookie("token" , token , {
        httpOnly : true , 
        secure : true , 
        sameSite : "none" , 
        maxAge:5 * 60 * 1000
      })

      return res.status(200).json({response:true , message : "OTP sent successfully"})
    } catch (error) {
      return next(new Error(error.message))
    }
}
//verify Otp

export const verifyOtp = async (req , res , next)=>{
  try {
    const {otp} = req.body
    const token = req.cookies.token

    if (!otp) {
      return res.status(400).json({response:false , message : "OTP is required"})
    }

    if (!token) {
      return res.status(400).json({response:false , message : "Unable to verify OTP"})
    }

    const decoded = jwt.verify(token , ENV.JWT_SECRET_KEY)

    if (!decoded) {
      return res.status(400).json({response:false , message : "Unable to verify OTP"})
    }

    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(400).json({response:false , message : "User not found"})
    }

    if (otp !== user.otp) {
      return res.status(400).json({response:false , message : "Invalid OTP"})
    }

    return res.status(200).json({response:true , message : "OTP verified successfully"})


  } catch (error) {
    return next(new Error(error.message))
  }
  }

//reset password

export const resetPassword = async (req , res , next)=>{
    try {
      const token = req.cookies.token
      const {password} = req.body

      if (!token) {
        return res.status(400).json({response:false , message : "Token not found"})
      }

      if (!password) {
        return res.status(400).json({response:false , message : "New Password is required"})
      }

      const decoded = jwt.verify(token , ENV.JWT_SECRET_KEY)

      if (!decoded) {
        return res.status(400).json({response:false , message : "Token not found"})
      }

      //hash Password 
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password , salt)

      const user = await User.findByIdAndUpdate(decoded.id , {
        password:hashedPassword
      })

      if (!user) {
        return res.status(400).json({response:false , message:"User password not updated"})
      }
      user.otp = ""
      await user.save()

      res.clearCookie("token" , {
        httpOnly : true , 
        secure : true , 
        sameSite : "none" , 
        maxAge:5 * 60 * 1000
      })
      return res.status(200).json({response:true , message : "User password updated successfully"})

    } catch (error) {
      return next(new Error(error.message))
    }
}

export const sendOtpVerification = async (req , res , next)=> {
try {
    // get email from the token 
    const authenticatedUser = req.user
    if (!authenticatedUser) return res.status(400).json({response:false , message : "Not Authenticated Please Login Again"})
     
      const user = await User.findById(authenticatedUser)

      if (!user) return res.status(400).json({response:false , message : "User not found"})
      
      if (user.isVerified) return res.status(400).json({response:false , message : "User already verified"})
  // otp send to email by nodemailer (by nanoid package)
      const generateOtp = customAlphabet("123456789abcdefghijklmnopqrstuvwxyz",5)
      const otp = generateOtp()
      await sendEmail ({to:user.email ,  subject : "Verify Your Account" , html: emailTemplate_Verification({otp})})
  // save otp in database
    user.verificationToken = otp 
    await  user.save()
    return res.status(200).json({response:true , message : "Otp sent successfully" })

} catch (error) {
  return next(new Error(error.message))
}
}

export const verifyAccount = async (req, res , next)=>{
  try {
    const {otp} = req.body
    const authenticatedUser = req.user

    if (!otp) return res.status(400).json({response:false , message : "Otp is required"})

    if (!authenticatedUser) return res.status(400).json({response:false , message : "Not Authenticated Please Login Again"})

    const user = await User.findById(authenticatedUser)

    if (!user) return res.status(400).json({response:false , message : "User not found"})

    if (user.isVerified) return res.status(400).json({response:false , message : "User already verified"})

    if (user.verificationToken !== otp) return res.status(400).json({response:false , message : "Invalid Otp"})

    user.isVerified = true
    user.verificationToken = ""
    await user.save()

    return res.status(200).json({response:true , message : "User verified successfully"})
  } catch (error) {
    return next(new Error(error.message))
  }
}

export const subscribeChannel = async (req, res, next) => {
  try {
    const channelId = req.params.id
    const userId = req.user

    if (!mongoose.Types.ObjectId.isValid(channelId) || !channelId) {
      return res.status(400).json({ success: false, message: "Invalid Channel ID" })
    }

    if (userId==channelId) {
      return res.status(400).json({ success: false, message: "You can't subscribe to yourself" })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { subscriptions: channelId } }, // ✅ correct usage
      { new: true }
    )

    if (!updatedUser) {
      return res.status(400).json({ success: false, message: "Subscription failed" })
    }

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully"
    })

  } catch (error) {
    next(error)
  }
}



// UNSUBSCRIBE CHANNEL

export const unsubscribeChannel = async (req , res , next)=>{
try {
    const channelId = req.params.id
    const user = req.user
    if (user == channelId) return res.status(400).json({success:false , message:"U Can't UnSubscribe To Yourself"})
    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) return res.status(400).json({success:false , message:"We Can't UnSubscribe To This Channel"})
    
    const User_ = await User.findByIdAndUpdate({_id:user} , {$pull : {subscriptions : channelId}} , {new:true} )

    if (!User_) return res.status(400).json({success:false  , message: "UnSubscription is not Completed"})

    return res.status(201).json({success:true , message:"UnSubscribed Successfully"})    
 } catch (error) {
    return next(new Error(error.message))
 }
}