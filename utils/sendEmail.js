import nodemailer from "nodemailer"
import {ENV} from "./env.js"

const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
     port: 587,
     secure: false, // true for port 465
    auth : {
        user : ENV.EMAIL , 
        pass :ENV.PASSWORD
    }
})

export const sendEmail = async ({to , subject,  html})=>{
    await transporter.sendMail({
        from:"<"+ ENV.EMAIL + ">",
        to  , 
        subject  , 
        html
    })
}