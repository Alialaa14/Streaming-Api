import dotenv from "dotenv"

dotenv.config()


export const ENV = {
    PORT : process.env.PORT , 
    MONGO_URL : process.env.MONGO_URL , 
    CLOUD_NAME : process.env.CLOUD_NAME , 
    API_KEY : process.env.API_KEY , 
    API_SECRET : process.env.API_SECRET , 
    JWT_SECRET_KEY : process.env.JWT_SECRET_KEY , 
    EMAIL : process.env.EMAIL ,
    PASSWORD : process.env.PASSWORD
}