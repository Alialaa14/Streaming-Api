import { Router } from "express";
import { commentVideo, deleteVideo, dislikeVideo, downloadVideo, getVideosOfChannel, likeVideo, saveVideo, updateVideo, uploadVideo } from "../controler/video.controler.js";
import upload from "../utils/uploadVideo.js"
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
.post("/video" ,upload.single("video"), uploadVideo)
.patch("/video/:id" , updateVideo)
.delete("/video/:id" , deleteVideo)
.post("/video/like/:id" , likeVideo)
.post("/video/dislike/:id" , dislikeVideo)
.post("/video/comment/:id" , commentVideo)
.get("/video/download/:id", downloadVideo)
.post("/video/save/:id" ,saveVideo)
.get("/video/channel/:id" , getVideosOfChannel)


export default videoRouter
