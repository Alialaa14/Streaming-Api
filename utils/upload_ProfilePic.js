import multer , {diskStorage} from "multer";
import path from "path";
import { v4 as uuid } from "uuid"


const storage = diskStorage({
    destination : (req , file , cb)=>{
        cb(null , "./uploads/profilePic");
    } , 
    filename : (req , file , cb)=>{
        const ext = path.extname(file.originalname);
        const filename = "profilePic" + uuid() + ext;
        cb(null , filename);
    }
});

const fileFilter = (req, file , cb)=>{
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null , true);
    }
    else {
        cb(null , false);
    }
}

const uploadPfPic = multer({storage , fileFilter , limits : {fileSize : 10 * 1024 * 1024}})


export default uploadPfPic