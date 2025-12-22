import { model, Schema, Types } from "mongoose";

const videoSchema = new Schema({
    title : {
        type:String , 
        required:true
    } , 
    description : {
        type:String , 
        required:true
    }
     , 
     thumbnail : {
        public_id : {type:String , required:true} , 
        url : {type:String , required:true} , 
    } , 
    url : {
        public_id : {type:String} , 
        url : {type:String} 
    }
     , 
     views : {
        type:Number , 
        default:0
    }
     , 
     child_propriate : {
        type:Boolean , 
       required:true 
     } , 
     category : {
        type:String , 
        required:true
     } , 
     tags:{
        type:String , 
        default : ""
    } , 
    comments : {
        type:[Types.ObjectId] , 
        default : [] , 
        ref:"Comment"
    } , 
    likes: {
        type:Number ,
        default:0 
    } , 
    dislikes : {
        type:Number , 
        default:0
    }
    , 
    preview : {
       public_id : String , 
       url : String
    }
    , 
    user:{
        type:Types.ObjectId , 
        ref:"User" , 
        required:true
    }
    

} , {timestamps : true})

const Video = model("Video" , videoSchema)

export default Video