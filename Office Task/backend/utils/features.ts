import jwt, { JwtPayload } from "jsonwebtoken"
import multer from "multer";
import nodemailer from "nodemailer"
import { date } from "zod";

interface CustomJwtPayload extends JwtPayload {
    _id: string;
    token: string;
}

interface MailOption {
    email: string;
    subject: string,
    html: string
}

const createJWTToken = (_id: string) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET as string, { expiresIn: "15d" })
}


const emitEvent = (req: any, event: any, data: any) => {
    const io = req.app.get("io")
    io.emit(event, data)
}

const emitBroadcast = (req: any, event: any, data: any) => {
    const io = req.app.get("io")
    io.broadCast.emit(event, data)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
})

const sendMailFeature = async (option: MailOption) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOption = {
        from: process.env.EMAIL,
        to: option.email,
        subject: option.subject,
        html: option.html
    }

    return await transporter.sendMail(mailOption)

}


export { createJWTToken, emitEvent, storage, sendMailFeature, emitBroadcast }