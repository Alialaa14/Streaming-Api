import mongoose from "mongoose";


export const connectDB = async()=>{
try {
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("Connected to DB Successfully")
    })
    .catch((error)=>{
        console.log("Error in connecting to DB" , error)
    })
} catch (error) {
    console.log("Error in connecting to DB" , error)
}
}