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
        type:String , 
        required:true
    } , 
    url : {
        public_id:String , 
        url : String
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
        default : []
    } , 
    comments : {
        type:[Types.ObjectId] , 
        default : []
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
    user : {
        type:Types.ObjectId 
    }
    , 
    preview : {
       public_id : String , 
       url : String
    }
    

} , {timestamps : true})

const Video = model("Video" , videoSchema)

export default Video