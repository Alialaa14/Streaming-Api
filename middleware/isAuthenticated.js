import {ENV} from "../utils/ENV.js"
import jwt from "jsonwebtoken"
export const  isAuthenticated = (req , res , next) =>{
try {
    const token = req.cookies.token 

    if (!token) {
        return res.status(401).json({message : "Unauthorized Please Login"})
    }

    const decoded = jwt.verify(token , ENV.JWT_SECRET_KEY)

    if (!decoded) {
        return res.status(401).json({message : "Unauthorized Please Login"})
    }

    req.user = decoded.id

    next()

} catch (error) {
    return next(new Error(error.message))
}
}