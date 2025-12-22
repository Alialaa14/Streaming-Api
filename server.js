import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {connectDB} from "./DB/connectDB.js"
import videoRouter from "./routes/video.routes.js"
import userRouter from "./routes/user.routes.js"
import {ENV} from "./utils/ENV.js"
import commentRouter from "./routes/comment.routes.js"


const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use("/api/v1/auth" , userRouter) 
app.use("/api/v1/video" , videoRouter)
app.use("/api/v1/video/comment" , commentRouter)




app.use((error , req, res, next)=>{
    return res.status(500).json({message : error.message})
})

app.listen(ENV.PORT , ()=>{
    console.log(`Server is running on port ${ENV.PORT}`)
    connectDB()
})