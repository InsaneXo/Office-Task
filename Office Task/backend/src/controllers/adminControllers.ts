import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AdminBlackListTokenModel from "../models/adminBlacklistToken";
import AdminTokenModel from "../models/adminToken";
import ProductModel from "../models/product";
import UserModel from "../models/user";
import fs from "fs"
import UserTokenModel from "../models/token";
import BlackListTokenModel from "../models/blacklist";

const adminLoginControllers = async (req: Request, res: Response): Promise<any> => {
    try {
        const { secretKey } = req.body
        const key = process.env.SECRET_KEY

        if (!secretKey) {
            return res.status(400).json({ success: false, message: "Secret Key Must be required" })
        }

        const isMatched = secretKey === key

        if (!isMatched) {
            return res.status(401).json({ success: false, message: 'Please Enter the valid secret key' })
        }

        const token = jwt.sign({ secretKey }, process.env.JWT_SECRET as string, { expiresIn: "15m" })

        await AdminTokenModel.create({
            token,
            expiresAt: new Date(new Date().getTime() + 15 * 60 * 1000)
        })

        return res.status(200).json({ success: true, message: "Admin Logged in", token })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const checkAdminControllers = async (req: Request, res: Response): Promise<any> => {
    try {
        return res.status(200).json({ success: true, message: "Admin Logged In" })

    } catch (err: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const adminDashBoardControllers = async (req: Request, res: Response): Promise<any> => {
    try {
        const products = await ProductModel.find({})
        const users = await UserModel.countDocuments()
        const loggedInUser: any = await UserTokenModel.find({}).populate("userId")

        const topBiddingProducts = products.map((item) => ({
            ...item.toObject(),
            productImage: `data:image/png;base64,${fs.readFileSync(item.productImage.path).toString("base64")}`
        })).sort((a: any, b: any) => b.currentBid - a.currentBid).slice(0, 5)

        const totalLoggedInUser = loggedInUser.filter((user: any) => {
            try {
                jwt.verify(user.token, process.env.JWT_SECRET as string);
                return true
            } catch (err: any) {
                return false;
            }
        }).map((user: any) => {
            return {
                _id: user._id,
                issuesAt: user.issuesAt,
                expiresAt: user.expiresAt,
                displayName: user.userId?.displayName,
                email: user.userId?.email,
                profileImage: user.userId?.profileImage.path ? `data:image/png;base64,${fs.readFileSync(user.userId?.profileImage.path).toString("base64")}` : user.userId?.profileImage.demoImage
            }
        })

        const dashboardStats = {
            products: products.length,
            users: users,
            data: [
                { label: "Products", value: products.length },
                { label: "Users", value: users },
                { label: "Logged in User", value: totalLoggedInUser.length }
            ],
            topBiddingProducts,
            totalLoggedInUser
        }



        return res.status(200).json({ sucesss: true, dashboardStats })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const allUsersControllers = async (req: Request, res: Response): Promise<any> => {
    try {
        const { search = "" } = req.query
        const users = await UserModel.find({
            $or: [
                { email: { $regex: search, $options: "i" } },
                { profileImage: { $regex: search, $options: "i" } },
                { displayName: { $regex: search, $options: "i" } }]
        })

        const usersMap = users.map((item) => {
            return {
                _id: item._id,
                displayName: item.displayName,
                email: item.email,
                profileImage: item.profileImage.path ? `data:image/png;base64,${fs.readFileSync(item.profileImage.path).toString("base64")}` : item.profileImage.demoImage
            }
        })

        return res.status(200).json({ success: true, users: usersMap })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const allProductsControllers = async (req: Request, res: Response): Promise<any> => {
    try {

        const { catagory = "" } = req.query

        const products: any = await ProductModel.find({ genericName: { $regex: catagory, $options: "i" } }).populate("createBy")
        const categories = await ProductModel.aggregate([
            {
                $match: { catagory: { $ne: null } },
            },
            {
                $group: {
                    _id: "$catagory",
                    genericNames: { $addToSet: "$genericName" },
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    genericNames: {
                        $sortArray: { input: "$genericNames", sortBy: 1 },
                    },
                },
            },
        ])


        const productsMap = products.map((item: any) => {
            return {
                _id: item._id,
                productName: item.productName,
                productImage: `data:image/png;base64,${fs.readFileSync(item.productImage.path).toString("base64")}`,
                currentBid: item.currentBid,
                createdBy: item.createBy.email,
                startsIn: item.startsIn,
                endsIn: item.endsIn
            }
        })



        return res.status(200).json({ success: true, products: productsMap, categories })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const deleteProductControllers = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id
        const findProduct = await ProductModel.findById(id)
        const user = await UserModel.findById(findProduct?.createBy)

        if (!id) {
            return res.status(400).json({ success: false, message: "Id field must be required" })
        }

        if (!findProduct) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        if (user?.recentBid.includes(findProduct._id as any)) {
            const index = user.recentBid.findIndex((index) => index._id.toString() === id)
            user.recentBid.splice(index, 1)
            await user.save()
        }

        if (user?.ownProduct.includes(findProduct._id as any)) {
            const index = user.ownProduct.findIndex((index) => index._id.toString() === id)
            user.ownProduct.splice(index, 1)
            await user.save()
        }

        await findProduct.deleteOne()

        return res.status(200).json({ success: true, message: "Product Deleted" })


    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }

}
const deleteUserControllers = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id
        const user = await UserModel.findById(id)


        if (!id) {
            return res.status(400).json({ success: false, message: "Id field must be required" })
        }

        await ProductModel.deleteMany({ createBy: user?._id })
        await UserTokenModel.deleteMany({ userId: user?._id })
        await user?.deleteOne()

        return res.status(200).json({ success: true, message: "User Deleted" })


    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }

}

const userLogoutControllers = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.body
        const findToken = await UserTokenModel.findById(id)

        if (!id) {
            return res.status(400).json({ success: false, message: "Token field must be required" })
        }

        if (!findToken) {
            return res.status(404).json({ success: false, message: "User already Logged out" })
        }

        await BlackListTokenModel.create({
            token: findToken.token,
            userId: findToken.userId,
            issuesAt: findToken.issuesAt,
        })

        await findToken.deleteOne()

        return res.status(200).json({ success: true, message: "User Logged out Successfully" })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const adminLogoutControllers = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({ success: false, message: "Token field must be Required" })
        }
        const findTokenInDB = await AdminTokenModel.findOne({ token })

        if (!findTokenInDB) {
            return res.status(403).json({ success: false, message: "Invaild Token" })
        }

        await AdminBlackListTokenModel.create({
            token,
            issuesAt: findTokenInDB?.issuesAt,
            expiresAt: Date.now()
        })

        await findTokenInDB?.deleteOne()

        return res.status(200).json({ success: true, message: "Admin Logged out" })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}


export { adminDashBoardControllers, adminLoginControllers, adminLogoutControllers, checkAdminControllers, allUsersControllers, allProductsControllers, userLogoutControllers, deleteProductControllers, deleteUserControllers };
