import { Router } from "express";
import { 
         deleteVideo, 
         dislikeVideo, 
         downloadVideo,
         getChannelVideos,
         likeVideo,
         saveVideo, 
         updateVideo, 
         uploadVideo ,
         getVideo,
         getTimeLineVideos,
      } from "../controler/video.controler.js";
import upload from "../utils/Upload.js"
import {isAuthenticated} from "../middleware/isAuthenticated.js"


// upload Video
//update Video with id 
//delete Video with id 
//like Video with id 
//dislike Video with id 
//comment to Video with id 
//download videos
//save video to watch later
//get all videos of certain channel




const videoRouter = Router()

videoRouter
.get("/timeline" , isAuthenticated , getTimeLineVideos)
.post("/" ,isAuthenticated,upload.fields([{name : "video" , maxCount:1} , {name : "thumbnail" , maxCount:1}]), uploadVideo)
.patch("/:id" , isAuthenticated, upload.fields([{name:"thumbnail" , maxCount:1}]) ,  updateVideo)
.delete("/:id" , isAuthenticated, deleteVideo)
.post("/like/:id" , isAuthenticated , likeVideo)
.post("/dislike/:id" ,isAuthenticated ,  dislikeVideo)
.get("/download/:id",isAuthenticated , downloadVideo)
.post("/save/:id" ,isAuthenticated , saveVideo)
.get("/:id" ,isAuthenticated ,  getVideo)
.get("/channel/:id" ,isAuthenticated ,  getChannelVideos)



export default videoRouter
