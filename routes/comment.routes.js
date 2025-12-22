import {Router} from "express"
import {isAuthenticated} from "../middleware/isAuthenticated.js"
import { commentVideo , likeComment , dislikeComment, updateComment, deleteComment } from "../controler/comment.controler.js"


const commentRouter = Router()



commentRouter
.post("/:id" ,isAuthenticated ,  commentVideo)
.post("/like/:id" ,isAuthenticated ,  likeComment)
.post("/dislike/:id" ,isAuthenticated ,  dislikeComment)
.patch("/:id" , isAuthenticated ,  updateComment)
.delete("/:id" , isAuthenticated ,  deleteComment)
export default commentRouter