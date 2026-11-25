import nodemailer from "nodemailer";
import { env } from "../../config/env.service";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.emailUser,
        pass: env.appPassword
    }
});


export const sendEmail = ({to, subject, html}:{to:string, subject:string, html: string})=>{
    transporter.sendMail({
        from: "socialmedia@gmail.com",
        to,
        subject,
        html
    })

    console.log("email sent");
}

