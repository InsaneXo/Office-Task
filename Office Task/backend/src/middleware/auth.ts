import { NextFunction, Request, Response } from "express"
import UserTokenModel from "../models/token";
import BlackListTokenModel from "../models/blacklist";
import jwt from "jsonwebtoken"
import AdminTokenModel from "../models/adminToken";
import AdminBlackListTokenModel from "../models/adminBlacklistToken";

interface DecodedToken {
    _id: string;
}

export interface CustomRequest extends Request {
    user?: DecodedToken | any;
}


const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ succes: false, message: "Session Expired, You need to login First" })
    }

    try {
        const findingTokenInDB = await UserTokenModel.findOne({ token })
        const findingTokenInBlackListed = await BlackListTokenModel.findOne({ token })

        if (findingTokenInBlackListed) {
            return res.status(401).json({ succes: false, message: "This User was already Logged out, You need to login First" })
        }

        if (!findingTokenInDB) {
            return res.status(401).json({ succes: false, message: "Session Expired, You need to login First" })
        }

        jwt.verify(findingTokenInDB.token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ success: false, message: "Session Expired, You need to login First" })
                }
                return res.status(403).json({ success: false, message: "Invaild Token" })

            }
            req.user = user
            next()
        })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error 2", error: error.message })
    }

}

const adminAuthMiddleware = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: "Session Expired, You need to login First" })
    }

    try {
        const findTokenInDB = await AdminTokenModel.findOne({ token })
        const findTokenInBlackListedModel = await AdminBlackListTokenModel.findOne({ token })



        if (findTokenInBlackListedModel) {
            return res.status(401).json({ success: false, message: "This User was already Logged out, You need to login First" })
        }

        if (!findTokenInDB) {
            return res.status(401).json({ success: false, message: "Session Expired, You need to login First" })
        }


        jwt.verify(findTokenInDB.token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ success: false, message: "Session Expired, You need to login First" })
                }
                return res.status(403).json({ success: false, message: "Invaild Token" })
            }

            next()
        })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

export { authMiddleware, adminAuthMiddleware }