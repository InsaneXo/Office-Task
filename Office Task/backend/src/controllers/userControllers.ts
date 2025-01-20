import { Request, Response } from "express";
import { CustomRequest } from "../middleware/auth";
import ProductModel from "../models/product";
import UserModel from "../models/user";
import fs from "fs"
import SearchModel from "../models/Search";
import { ObjectId } from "mongoose";

interface User {
    username: string,
    email?: string,
    phoneNo?: string,
    password: string,
    displayName: string
}


const deleteUserController = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId: string = req.params.id


        const user = await UserModel.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        await user.deleteOne()

        return res.status(200).json({ success: true, message: "User Deleted successfully" })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const updateUserController = async (req: Request, res: Response): Promise<any> => {
    try {


        const { username, email, phoneNo, password, displayName }: User = req.body

        const user = await UserModel.findById(req.user)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        if (req.file) {
            user.profileImage.filename = req.file.filename
            user.profileImage.path = req.file.path
        }

        if (username) {
            const existingUser = await UserModel.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "User ID already exists" });
            }
            user.username = username
            user.displayName = username
        }

        if (email) {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }
            user.email = email
        }

        if (phoneNo) {
            const existingUser = await UserModel.findOne({ phoneNo });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Phone No already exists" });
            }
            user.phoneNo = phoneNo
        }

        if (password) {
            user.password = password
        }

        if (displayName) {
            user.displayName = displayName
        }



        await user.save()

        return res.status(200).json({ success: true, message: "User Updated Successfully", })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const showUserDetailsController = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.params.id
        const user = await UserModel.findById(userId)

        if (!user) {
            return res.status(404).json({ success: true, message: "User not found" })
        }

        return res.status(200).json({ success: true, user })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}


const myProfileController = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const user = await UserModel.findById(req.user).populate('recentBid');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const recentBid = await Promise.all(
            user?.recentBid.map(async (item) => {
                const product: any = await ProductModel.findById(item._id);
                if (!product) {
                    return null;
                }
                const base64Image = fs.readFileSync(product.productImage.path as string);
                return {
                    _id: product._id,
                    productName: product.productName,
                    productImage: `data:image/png;base64,${base64Image.toString('base64')}`,
                    startsIn: product.startsIn,
                    endsIn: product.endsIn,
                    currentBid: product.currentBid,
                    description: product.description,
                    createBy: product.createBy,
                    bids: product.bids,
                };
            })
        );

        const ownProduct = await Promise.all(
            user?.ownProduct.map(async (item) => {
                const product: any = await ProductModel.findById(item._id);
                if (!product) {
                    return null;
                }
                const base64Image = fs.readFileSync(product.productImage.path as string);
                return {
                    _id: product._id,
                    productName: product.productName,
                    productImage: `data:image/png;base64,${base64Image.toString('base64')}`,
                    startsIn: product.startsIn,
                    endsIn: product.endsIn,
                    currentBid: product.currentBid,
                    description: product.description,
                    createBy: product.createBy,
                    bids: product.bids,
                };
            })
        );
        const bookmarkedProduct = await Promise.all(
            user?.bookmarkedProduct.map(async (item) => {
                const product: any = await ProductModel.findById(item._id);
                if (!product) {
                    return null;
                }
                const base64Image = fs.readFileSync(product.productImage.path as string);
                return {
                    _id: product._id,
                    productName: product.productName,
                    productImage: `data:image/png;base64,${base64Image.toString('base64')}`,
                    startsIn: product.startsIn,
                    endsIn: product.endsIn,
                    currentBid: product.currentBid,
                    description: product.description,
                    createBy: product.createBy,
                    bids: product.bids,
                };
            })
        );


        const userProfileImage = user?.profileImage.path
            ? `data:image/png;base64,${fs.readFileSync(user.profileImage.path as string).toString('base64')}`
            : user?.profileImage.demoImage;


        const userObject = {
            _id: user._id,
            googleId: user.googleId,
            username: user.username,
            displayName: user.displayName,
            balance: user.balance,
            email: user.email,
            phoneNo: user.phoneNo,
            profileImage: userProfileImage,
            ownProduct: ownProduct,
            recentBid: recentBid,
            bookmarkedProduct: bookmarkedProduct
        }
        return res.status(200).json({ success: true, user: userObject });
    }
    catch (error: any) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


const bidController = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { bidAmount } = req.body
        const productId = req.params.id

        const user: any = await UserModel.findById(req.user)
        const product = await ProductModel.findById(productId)

        // If User is not found in database
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // If Product is not found in database
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not found" })
        }

        // If bid is less than or equal to the current bid
        if (bidAmount <= product.currentBid) {
            return res.status(400).json({ success: false, message: "Your bid is less than or equal to the current bid" });
        }

        if (product?.bids.some((bid) => bid.userId.toString() === req.user._id)) {
            const index = product?.bids.findIndex((index) => index.userId.toString() === req.user._id)

            product.bids[index].bid = bidAmount

            product.currentBid = bidAmount
            await product.save()

            if (!user.recentBid.includes(product._id)) {
                user.recentBid.push(product._id)
                await user.save()
                console.log("User.recentBid code execute")
                return res.status(200).json({ success: true, message: "Bid successfully Added" })
            }

            return res.status(200).json({ success: true, message: "Bid successfully Added" })
        }

        product.bids.push({ userId: user._id, bid: bidAmount })
        user.recentBid.push(product._id)

        product.currentBid = bidAmount

        await product.save()
        await user.save()

        return res.status(200).json({ success: true, message: "Bid successfully Added" })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }

}

const addBookmarkedController = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { productId } = req.body

        const product: any = await ProductModel.findById(productId)
        const user: any = await UserModel.findById(req.user)

        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" })
        }

        if (user?.bookmarkedProduct.includes(product._id)) {
            const index = user.bookmarkedProduct.findIndex((index: any) => index._id.toString() === product._id.toString())

            user.bookmarkedProduct.splice(index, 1)

            await user.save()
            return res.status(200).json({ success: true, message: "Bookmark Removed" })
        }

        user?.bookmarkedProduct.push(product._id)

        await user.save()

        return res.status(200).json({ success: true, message: "Bookmark Added" })


    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }

}

const addBalanceController = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { balance } = req.body
        const user = await UserModel.findById(req.user)

        if (balance <= 0) {
            return res.status(400).json({ success: false, message: "Sorry you can't add this amount, Balance must be greater than zero." })
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" })
        }

        user.balance += balance
        await user.save()

        return res.status(200).json({ success: true, message: `$${balance} Balance successfully added in your account` })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }

}

const proceedToPayController = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { amount } = req.body
        const productId = req.params.id
        const user = await UserModel.findById(req.user)
        const product = await ProductModel.findById(productId)

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount field must be required." })
        }

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." })
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" })
        }

        if (amount > user.balance) {
            return res.status(400).json({ success: false, message: "Insufficient Balance, Please Top-up your account Balance" })
        }

        user.balance -= amount

        user.winningBid.push(product._id as any)

        product.winner = user._id as string

        await user.save()
        await product.save()

        return res.status(200).json({ success: true, message: "Payment made successfully" })


    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const deniedPaymentController = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const productId = req.params.id
        const product = await ProductModel.findById(productId)

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        if (product.bids.some((bid) => bid.userId.toString() === req.user._id)) {
            const index = product.bids.findIndex((bid) => bid.userId.toString() === req.user._id)
            product.bids.splice(index, 1)
            const highestBid = Math.max(...product.bids.map((item) => Number(item.bid)))

            product.currentBid = highestBid
            await product.save()
            return res.status(200).json({ success: true, message: "User Denied the Payment" })
        }

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}







export { bidController, deleteUserController, myProfileController, showUserDetailsController, updateUserController, addBookmarkedController, addBalanceController, proceedToPayController, deniedPaymentController };


