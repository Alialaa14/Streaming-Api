import { diskStorage }  from "multer";
import multer from "multer";
import path from "path"
import { v4 as uuid } from "uuid"
import fs from "fs"

/*
    Make the video and the thumbnail upload to the same folder
    folder naming will be == user-id + date.now it will for local storage and cloundinary folder


*/

const storage = diskStorage({
  destination : (req  , file , cb)=>{
    if (!req.folder) {
      req.folder = `./uploads/${Date.now()}`

      fs.mkdirSync(req.folder , {recursive : true});
    }
    cb(null , req.folder);
  } , 

  filename : (req, file , cb)=>{
    if (file.fieldname === "video") {
      const ext = path.extname(file.originalname);
      const filename = "video _" + uuid() + ext;
      cb(null, filename);
    }
    if (file.fieldname === "thumbnail") {
      const ext = path.extname(file.originalname);
      const filename = "thumbnail" + uuid() + ext;
      cb(null, filename);
    }

   
  }
})



const fileFilter = (req , file , cb)=>{
  if (file.fieldname === "video") {
    if (file.mimetype === "video/mp4" || file.mimetype === "video/webm") {
      cb(null , true);
    } else {
      cb(new Error("Mp4 and webm files only are allowed"), false);
      }
  }
  if (file.fieldname === "thumbnail") {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      if (file.size > 10 * 1024 * 1024) {
        cb(new Error("Image size should be less than 10MB"), false);
      }
      cb(null , true);
    } 
    else {
        cb(new Error("png and jpeg files only are allowed"), false);
    }
  }
}


const upload = multer ({storage , fileFilter})

export default upload;
