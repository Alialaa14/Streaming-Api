import Video from "../models/video.model.js"
import cloudinary from "../utils/cloudinary.js"
import fs from "fs"
export const uploadVideo = async (req, res , next) => {
    try {
        // Recieve Video Details From Request
        // Recieve multer File From Request 
        // Validate Video Details

        const {title , description , thumbnail , child_propriate , tags , category} = req.body
        const video = req.file

        if(!title || !description || child_propriate===undefined || !category || !tags){
            return res.status(400).json({message : "All Fields are Required"})
        }

        if (!video) return res.status(400).json({message : "Video is Required"})

        if (description.length > 1000) return res.status(400).json({message : "Description is too long"})

        // Thumbnail
        // Create Preview
        
        // Upload Video To Cloudinary
        const {public_id , secure_url } = await cloudinary.uploader.upload(video.path , {resource_type : "video" , folder : "streaming-api"} , (err , result)=>{
            if (err) console.error("Failed to upload video to Cloudinary:", err);
            console.log(result)
        })
       // DELETE LOCAL VIDEO
          fs.unlink(video.path, (err) => {
              if (err) console.error("Failed to delete local video:", err);
          });
        // Save Video to DB

        const createdVideo = await Video.create({
            title , 
            description ,
            thumbnail , 
            url : {
                public_id , 
                url : secure_url
            } ,  
            child_propriate , 
            tags , 
            category
        })

        if (!createdVideo) return res.status(500).json({message : "Error in Creating Video"})

        return res.status(200).json({success : true , message : "Video Uploaded Successfully" , video : createdVideo})
      

    } catch (error) {
        return res.status(500).json({message : error.message})
    }

}

export const updateVideo = (req, res , next) => {}

export const deleteVideo = (req, res , next) => {}

export const likeVideo = (req, res , next) => {}

export const dislikeVideo = (req, res , next) => {}

export const commentVideo = (req, res , next) => {}

export const downloadVideo = (req, res , next) => {}

export const saveVideo = (req, res , next) => {}

export const getVideosOfChannel = (req, res , next) => {}



