import Video from "../models/video.model.js"
import Comment from "../models/comments.model.js"
import cloudinary from "../utils/cloudinary.js"
import fs from "fs"
import mongoose from "mongoose"
import User from "../models/user.model.js"
export const uploadVideo = async (req, res , next) => {
    try {
        // TO DO => Naming of the folder in the cloud Explore Some Conventions

        // Recieve Video Details From Request
        // Recieve multer File From Request 
        // Validate Video Details
        const video = req.files?.video?.[0]
        const thumbnail = req.files?.thumbnail?.[0]
        const user = req.user


        const {title , description , child_propriate , tags , category} = req.body

        if(!title || !description || child_propriate===undefined || !category || !tags){
            return res.status(400).json({message : "All Fields are Required"})
        }

        if (!video) return res.status(400).json({message : "Video is Required"})
        
        // Thumbnail
        // To DO => To make automatic thumbnail if not provided from user
        if (!thumbnail) return res.status(400).json({message : "Thumbnail is Required"})

        if (description.length > 1000) return res.status(400).json({message : "Description is too long"})
                
        // TO DO => To Create Preview video for 5 seconds


        // generate objectID before creating to use it as folder name in cloudinary
        
        const videoId = new mongoose.Types.ObjectId()
              

        // Upload Video To Cloudinary
        const {public_id : c_videoId , secure_url : videoUrl } = await cloudinary.uploader.upload(video.path , {resource_type : "video" , folder : `${user}-${videoId}`} , (err , result)=>{
            if (err) console.error("Failed to upload video to Cloudinary:", err);
        })

        // Upload Thumbnail To Cloudinary
        const {public_id : c_thumbnailId , secure_url : thumbnailUrl } = await cloudinary.uploader.upload(thumbnail.path , {folder : `${user}-${videoId}`} , (err , result)=>{
            if (err) console.error("Failed to upload thumbnail to Cloudinary:", err);
        })

       // DELETE LOCAL DATA UPLOADED
       fs.rmSync(req.folder , {recursive : true})

        // Save Video to DB
        const createdVideo = await Video.create({
            _id:videoId,
            title , 
            description ,
            thumbnail : {
                public_id : c_thumbnailId , 
                url : thumbnailUrl
            }, 
            url : {
                public_id : c_videoId ,
                url : videoUrl
            } ,  
            child_propriate , 
            tags , 
            category , 
            user:user
        })

        if (!createdVideo) return res.status(500).json({message : "Error in Creating Video"})

        return res.status(200).json({success : true , message : "Video Uploaded Successfully" , video : createdVideo})
      

    } catch (error) {
        return res.status(500).json({message : error.message})
    }

}

export const updateVideo = async (req, res , next) => {
    try {
        const videoId = req.params.id
        
        const {title , description , child_propriate , tags , category} = req.body
        const thumbnail = req.files?.thumbnail[0]
       
        if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) return res.status(400).json({message : "Video Id is Required or Invalid"})
        const video = await Video.findById(videoId)
        if (!video) return res.status(400).json({message : "Video Not Found"})

         if(!title || !description || child_propriate===undefined || !category || !tags){
            return res.status(400).json({message : "All Fields are Required"})
        }

        if (description.length > 1000) return res.status(400).json({message : "Description is too long"})
        
        // Thumbnail Update 
        if (!thumbnail){
         const updatedVideo = await Video.findByIdAndUpdate(videoId , {
            title , 
            description ,
            child_propriate , 
            tags , 
            category
        } , {new : true})

        return res.status(200).json({success : true , message : "Video Updated Successfully" , video : updatedVideo})
        }
        // Delete previous Thumbnail from Cloudinary
        if (video.thumbnail.public_id){
            await cloudinary.uploader.destroy(video.thumbnail.public_id)
        }

        // Upload Thumbnail To Cloudinary
        if (thumbnail){
            const {public_id : thumbnailId , secure_url : thumbnailUrl } = await cloudinary.uploader.upload(thumbnail.path , {folder : title} , (err , result)=>{
                if (err) console.error("Failed to upload thumbnail to Cloudinary:", err);
            })

        
       // Save Video to DB
         const updatedVideo = await Video.findByIdAndUpdate(videoId , {
                title , 
                description ,
                thumbnail : {
                    public_id : thumbnailId , 
                    url : thumbnailUrl
                } , 
                child_propriate , 
                tags , 
                category
            } , {new : true})
       

        if (!updatedVideo) return res.status(500).json({message : "Error in Updating Video"})
        return res.status(200).json({success : true , message : "Video Updated Successfully" , video : updatedVideo})
        }

    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

export const deleteVideo = async(req, res , next) => {
    try {
        const videoId = req.params.id

        if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) return res.status(400).json({success:false , message:"Video Id is required or Invalid"})

        const deletedVideo = await Video.findByIdAndDelete(videoId)

        // TODO => TO DELETE VIDEO FROM CLOUDINARY
        
        if (!deletedVideo) return res.status(400).json({success:false , message:"Error while Deleting video"})

        await Comment.deleteMany({v_id : videoId})
        return res.status(200).json({success:true , message: "Deleltion of Video Completed Successfully"})    
        
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

export const likeVideo = async (req, res , next) => {
    try {
        const videoId = req.params.id
        const isliked = req.query.clk

        if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) return res.status(400).json({success:false , message:"Video Id is required or Invalid "})

        const video = await Video.findById(videoId)
        
        if (!video) return res.status(400).json({success:false , message:"We Can't Find Video"})

        if (isliked === "true") video.likes -=1
        if (isliked === "false") video.likes +=1
        
        await video.save()

        return res.status(200).json({success:true , message:"Proccess of like completed Successfully"})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const dislikeVideo = async (req, res , next) => {
    try {
        const videoId = req.params.id
        const isdisliked = req.query.clk

        if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) return res.status(400).json({success:false , message:"Video Id is required or Invalid "})

        const video = await Video.findById(videoId)
        
        if (!video) return res.status(400).json({success:false , message:"We Can't Find Video"})

        if (isdisliked === "true") video.dislikes -=1
        if (isdisliked === "false") video.dislikes +=1
        
        await video.save()

        return res.status(200).json({success:true , message:"Proccess of dislike completed Successfully"})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

// GET CERTAIN VIDEO

export const getVideo = async (req, res , next) => {
    try {
        const videoId = req.params.id

        if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) return res.status(400).json({success:false , message:"Video Id is required or Invalid "})

        const video = await Video.findById(videoId).populate("user" , {"username" : 1 , "profilePic" : 1  }).populate("comments")

        if (!video) return res.status(400).json({success:false , message:"We Can't Fetch Video"})

        return res.status(200).json({video})

    } catch (error) {
        return next(new Error(error.message))
    }
}


// GET USER(CHANNEL) VIDEOS
export const getChannelVideos = async (req , res , next)=>{
    try {
        const userId = req.user

        const videosChannel = await Video.find({user:userId}).populate('comments');

        if (!videosChannel) return res.status(400).json({success:false , message:"We Can't Reach This Channel"})


        return res.status(200).json({success:true , videos:videosChannel})    

    } catch (error) {
        return next(new Error(error.message))
    }
}



// GET ALL VIDEO (SUBSCRIBED CHANNELS)
export const getTimeLineVideos = async (req  , res , next)=>{
    try {
        const userId = req.user
        
        const SUBSCRIBED_Channels = await User.findById(userId)


        if (!SUBSCRIBED_Channels) return res.status(400).json({success:false , message:"WE Can't Get Videos Of Subscribed Channel "})
        
        const videosContainer = []
        for (let i = 0 ; i<SUBSCRIBED_Channels.subscriptions.length; i++) {
            let videos = await Video.find({user : SUBSCRIBED_Channels.subscriptions[i]})
            videosContainer.push(videos)
        }

        if (videosContainer.length == 0) return res.status(400).json({success:false , message:"We Can't Find Videos"})

         return res.status(200).json({success:true , videos:videosContainer})   
    } catch (error) {
        return next(new Error(error.message))
    }
}

export const downloadVideo = (req, res , next) => {}

export const saveVideo = (req, res , next) => {}




