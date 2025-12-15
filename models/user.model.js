import { Schema , model } from "mongoose";

const userSchema = new Schema({
    username : {
        type:String , 
        required:true
    }
    , 
    email : {
        type:String , 
        required:true , 
        unique : true
    } , 
    password : {
        type:String , 
        required:true
    }
     , 
     otp : {
        type:String , 
        default:""
     }
      , 
      forgetPassword : {
        type:String , 
        default:""
      } , 
      profilePic : {
        public_id : {type:String , default:""},
        secure_url : {type:String , default:"https://plus.unsplash.com/premium_photo-1677252438411-9a930d7a5168?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
      }  ,
       verificationToken : {
        type:String , 
        default:""
      }
      ,
      isVerified : {
        type:Boolean , 
        default:false
      }
}
, {timestamps:true})


const User = model("user" , userSchema)

export default User