import express from "express"
import { ENV } from "./utils/ENV.js"
import {connectDB} from "./DB/connectDB.js"
import videoRouter from "./routes/video.routes.js"


const app = express()
app.use(express.json())

app.use("/api/v1" , videoRouter)




app.use((error , req, res, next)=>{
    return res.status(500).json({message : error.message})
})

app.listen(ENV.PORT , ()=>{
    console.log(`Server is running on port ${ENV.PORT}`)
    connectDB()
})