import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { otpEmailTemplate, resetPasswordEmailTemplate } from "../../utils/CustomHTMLMessage";
import { createJWTToken, sendMailFeature } from "../../utils/features";
import BlackListTokenModel from "../models/blacklist";
import OtpModel from "../models/otp";
import UserTokenModel from "../models/token";
import UserModel from "../models/user";
import ResetLinkTokenModel from "../models/resetLinkToken";

interface User {
    username: string,
    email?: string,
    phoneNo?: string,
    password: string
    otp?: string
}

const userLoginController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, username, password }: User = req.body


        if ((!username && !email) || !password) {
            return res.status(400).json({ success: false, message: "Both Field are required" })
        }

        const query = username ? { username } : { email }

        const user = await UserModel.findOne(query).select("+password").populate("recentBid")

        const userObject = {
            _id: user?._id,
            googleId: user?.googleId,
            username: user?.username,
            displayName: user?.displayName,
            email: user?.email,
            phoneNo: user?.phoneNo,
            profileImage: user?.profileImage,
            recentBid: user?.recentBid
        }



        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const isMatched = user.password === password

        if (!isMatched) {
            return res.status(401).json({ success: false, message: "User Id or password are invalid" })
        }

        const generateToken = createJWTToken(user._id as string)

        await UserTokenModel.create({
            token: generateToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 3600 * 1000),
        })

        return res.status(200).json({ success: true, message: "User Logged in", user: userObject, token: generateToken })


    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const createUserController = async (req: Request, res: Response): Promise<any> => {

    try {
        const { username, email, phoneNo, password, otp }: User = (req.body)

        if (!username || !email || !phoneNo || !password || !otp) {
            return res.status(400).json({ success: false, message: "All Field are Required" })
        }

        const user = await UserModel.findOne({
            $or: [
                { username },
                { email },
                { phoneNo }
            ]
        })

        if (user) {
            let message = "User already exists.";
            if (user.username === username) {
                message = "Username already exists.";
            } else if (user.email === email) {
                message = "Email already exists.";
            } else if (user.phoneNo === phoneNo) {
                message = "Phone number already exists.";
            }

            return res.status(400).json({ success: false, message });
        }

        const findOtp = await OtpModel.findOne({ email })

        const isOtpMatched = findOtp?.otp === otp

        if (!isOtpMatched) {
            return res.status(401).json({ success: false, message: "OTP does not matched" })
        }

        await UserModel.create({
            username,
            displayName: username,
            profileImage: {
                demoImage: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
            },
            email,
            phoneNo,
            password,
        })

        await findOtp?.deleteOne()

        return res.status(201).json({ success: true, message: "User created successfuly" })
    } catch (error: any) {

        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const logoutController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.body

        if (!token) {
            return res.status(400).json({ success: false, message: "Token Field must be required" })
        }

        const findTokenInDB = await UserTokenModel.findOne({ token })

        if (!findTokenInDB) {
            return res.status(403).json({ success: false, message: "Invaild Token" })
        }

        await BlackListTokenModel.create({
            token: findTokenInDB?.token,
            userId: findTokenInDB?.userId,
            issuesAt: findTokenInDB?.issuesAt,
        })


        await findTokenInDB?.deleteOne()

        return res.status(200).json({ success: true, message: "User Logged out Successfully" })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const sendOtpController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, email, phoneNo, password } = req.body

        if (!username || !email || !phoneNo || !password) {
            return res.status(400).json({ success: false, message: "All Field are Required" })
        }

        const findOtp = await OtpModel.findOne({ email })
        const otpGenerate = Math.floor(10000 + Math.random() * 900000)
        const option = {
            email,
            subject: "Welcome to Desi Bazzar",
            html: otpEmailTemplate({ otp: otpGenerate.toString(), companyName: "The Desi Bazzar", userName: email })
        }

        const user = await UserModel.findOne({
            $or: [
                { username },
                { email },
                { phoneNo }
            ]
        })

        if (user) {
            let message = "User already exists.";
            if (user.username === username) {
                message = "Username already exists.";
            } else if (user.email === email) {
                message = "Email already exists.";
            } else if (user.phoneNo === phoneNo) {
                message = "Phone number already exists.";
            }

            return res.status(400).json({ success: false, message });
        }

        if (findOtp) {
            await findOtp.deleteOne()
            await OtpModel.create({
                otp: otpGenerate.toString(),
                email
            })
            await sendMailFeature(option)
            return res.status(200).json({ success: true, message: "OTP Sent to your email" })
        }

        await OtpModel.create({
            otp: otpGenerate,
            email
        })

        await sendMailFeature(option)

        return res.status(200).json({ success: true, message: "OTP Sent to your email" })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const sendforgetPasswordLinkController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body

        const findUser = await UserModel.findOne({ email })
        const findOTP = await OtpModel.findOne({ email })
        const otpGenerate = Math.floor(10000 + Math.random() * 900000)

        if (!email) {
            return res.status(400).json({ success: false, message: "Email Field must be required" })
        }

        if (!findUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const createToken = jwt.sign({ email: findUser.email }, process.env.JWT_SECRET as string, { expiresIn: "2m" })


        const resetLink = `${process.env.CLIENT_URL}/reset-password/${createToken}`

        const option = {
            email,
            subject: "Reset Your Password",
            html: resetPasswordEmailTemplate({ resetLink, userName: email, companyName: "The Desi Bazzar", otp: otpGenerate.toString() })
        }

        if (findOTP) {
            await findOTP.deleteOne()
            await OtpModel.create({
                otp: otpGenerate.toString(),
                email,
            })

            await ResetLinkTokenModel.create({
                token: createToken,
                email,
            })

            await sendMailFeature(option)
            return res.status(200).json({ success: true, message: "Reset Link and OTP are Sent to your email" })
        }


        await ResetLinkTokenModel.create({
            token: createToken,
            email,
        })

        await OtpModel.create({
            otp: otpGenerate.toString(),
            email,
        })
        await sendMailFeature(option)

        return res.status(200).json({ success: true, message: "Reset Link and OTP are Sent to your email" })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const verifyForgetPasswordController = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.params.token
        const { otp } = req.body
        const resetToken = await ResetLinkTokenModel.findOne({ token })


        if (!token) {
            return res.status(400).json({ success: false, message: "Token field must be required" })
        }

        if (!resetToken) {
            return res.status(401).json({ success: false, message: "Your Reset Link and OTP are expired" })
        }

        jwt.verify(token, process.env.JWT_SECRET as string, async (err, user: any) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ success: false, message: "Your Reset Link and OTP is expired" })
                }
                return res.status(403).json({ success: false, message: "Invaild Token" })
            } else {
                const findOTP = await OtpModel.findOne({ email: user?.email })
                const matchingOTP = findOTP?.otp === otp

                if (!matchingOTP) {
                    return res.status(401).json({ success: false, message: "OTP does not matched" })
                }
                return res.status(200).json({ success: true, message: "OTP Matched" })
            }
        })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const changePasswordController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { newPassword, confirmPassword } = req.body
        const token = req.params.token
        const resetToken = await ResetLinkTokenModel.findOne({ token })

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "Both field are Required" })
        }

        if (!token) {
            return res.status(404).json({ success: false, message: "Token Field Must be required" })
        }

        if (!resetToken) {
            return res.status(401).json({ success: false, message: "Your Reset Link and OTP are expired" })
        }

        const isMatched = newPassword === confirmPassword

        if (!isMatched) {
            return res.status(400).json({ success: false, message: "Password and Confirm Password are not matched" })
        }

        jwt.verify(token, process.env.JWT_SECRET as string, async (err, user: any) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ success: false, message: "Your Reset Link and OTP is expired" })
                }
                return res.status(403).json({ success: false, message: "Invaild Token" })
            } else {
                const findUser = await UserModel.findOne({ email: user?.email })
                const findOtp = await OtpModel.findOne({ email: user?.email })

                if (!findUser) {
                    return res.status(404).json({ success: false, message: "User Not Found" })
                }

                findUser.password = newPassword
                await findUser.save()
                await findOtp?.deleteOne()
                await resetToken?.deleteOne()

                return res.status(200).json({ success: true, message: "User Password Updated successfully" })
            }
        })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const checkTokenController = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.params.token
        const resetToken = await ResetLinkTokenModel.findOne({ token })

        if (!token) {
            return res.status(400).json({ success: false, message: "Token Must be required" })
        }

        if (!resetToken) {
            return res.status(401).json({ success: false, message: "Your Reset Link and OTP are expired" })
        }

        if (resetToken.reloadCount === 2) {
            await resetToken.deleteOne()
            return res.status(401).json({ success: false, message: "Your Reset Link and OTP are expired" })
        }

        jwt.verify(token, process.env.JWT_SECRET as string, async (err, user: any) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ success: false, message: "Your Reset Link and OTP is expired" })
                }
                return res.status(403).json({ success: false, message: "Invaild Token" })
            } else {
                resetToken.reloadCount += 1
                await resetToken.save()
                return res.status(200).json({ success: true, email: user.email })
            }
        })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}


export { changePasswordController, createUserController, logoutController, sendforgetPasswordLinkController, sendOtpController, userLoginController, verifyForgetPasswordController, checkTokenController };

