import { Request, Response } from "express"
import { emitBroadcast, emitEvent } from "../../utils/features"
import ProductModel from "../models/product"
import UserModel from "../models/user"
import fs from "fs"
import SearchModel from "../models/Search"

interface Product {
    productName: string
    productImage: string
    description: string
    currentBid: string
    startsIn: string
    genericName: string
    catagory: string
    endsIn: string
}

const addProductController = async (req: Request, res: Response): Promise<any> => {

    try {
        const { productName, catagory, genericName, currentBid, startsIn, endsIn, description, }: Product = req.body

        const user = await UserModel.findById(req.user)

        if (!productName || !currentBid || !startsIn || !endsIn || !description || !catagory || !genericName) {
            return res.status(400).json({ success: false, message: "All Fields are required" })
        }

        const product: any = await ProductModel.create({
            productName,
            currentBid,
            createBy: req.user,
            productImage: {
                filename: req.file?.filename,
                path: req.file?.path
            },
            catagory,
            genericName,
            description,
            startsIn,
            endsIn,
        })

        user?.ownProduct.push(product._id)

        await user?.save()

        const base64Image = fs.readFileSync(`${product.productImage?.path}`)

        const realTimeProductData = {
            _id: product._id,
            productName: product.productName,
            productImage: `data:image/png;base64,${base64Image.toString('base64')}`,
            startsIn: product.startsIn,
            endsIn: product.endsIn,
            currentBid: product.currentBid,
            description: product.description,
            createBy: product.createBy,
            bids: product.bids
        }

        emitEvent(req, "PRODUCT_UPDATE", realTimeProductData)
        return res.status(200).json({ success: true, message: "Product Created Successfully" })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const allProductController = async (req: Request, res: Response): Promise<any> => {
    try {
        const products: any = await ProductModel.find({}).limit(10);
        const allProducts = products.map((item: any) => {

            const base64Image = fs.readFileSync(item.productImage?.path);
            return {
                _id: item._id,
                productName: item.productName,
                productImage: `data:image/png;base64,${base64Image.toString('base64')}`,
                startsIn: item.startsIn,
                endsIn: item.endsIn,
                currentBid: item.currentBid,
                description: item.description,
                createBy: item.createBy,
                bids: item.bids
            };
        });

        return res.status(200).json({ success: true, products: allProducts });
    } catch (error: any) {
        // Error handling
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
const searchProductController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { searchQuery = "" } = req.query

        const products = await ProductModel.find({
            $or: [
                { catagory: { $regex: searchQuery, $options: "i" } },
                { productName: { $regex: searchQuery, $options: "i" } },
                { genericName: { $regex: searchQuery, $options: "i" } }
            ]
        })
        const allProducts = products.filter((item) => !item.winner).map((item: any) => {

            const base64Image = fs.readFileSync(item.productImage?.path);
            return {
                _id: item._id,
                productName: item.productName,
                productImage: `data:image/png;base64,${base64Image.toString('base64')}`,
                startsIn: item.startsIn,
                endsIn: item.endsIn,
                currentBid: item.currentBid,
                description: item.description,
                createBy: item.createBy,
                bids: item.bids
            };
        });

        return res.status(200).json({ success: true, products: allProducts });
    } catch (error: any) {
        // Error handling
        console.log(true)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const singleProductController = async (req: Request, res: Response): Promise<any> => {
    try {
        const productId = req.params.id;

        const findProduct = await ProductModel.findOne({ _id: productId }).populate("bids.userId");

        if (!findProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const base64Image = fs.readFileSync(findProduct.productImage.path).toString('base64');

        const bids = await Promise.all(
            findProduct.bids.map(async (item) => {
                const user = await UserModel.findById(item.userId);

                const userProfileImage = user?.profileImage.path
                    ? `data:image/png;base64,${fs.readFileSync(user.profileImage.path as string).toString('base64')}`
                    : user?.profileImage.demoImage;

                return {
                    userId: {
                        _id: user?._id,
                        displayName: user?.displayName,
                        profileImage: userProfileImage,
                    },
                    bid: item.bid,
                };
            })
        );

        const productObj = {
            _id: findProduct._id,
            productName: findProduct.productName,
            productImage: `data:image/png;base64,${base64Image}`,
            startsIn: findProduct.startsIn,
            endsIn: findProduct.endsIn,
            currentBid: findProduct.currentBid,
            description: findProduct.description,
            createBy: findProduct.createBy,
            bids,
        };

        return res.status(200).json({ success: true, product: productObj });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


const productFilterController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { catagory = "", genericName = "" } = req.query

        console.log(req.query)
        const product = await ProductModel.find({
            $and: [
                { catagory: { $regex: catagory, $options: "i" } },
                { genericName: { $regex: genericName, $options: "i" } }
            ]
        }).limit(7)

        const catagories = await ProductModel.aggregate([
            {
                $match: {
                    catagory: { $ne: null },
                    winner: { $exists: false }
                },
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
        ]).limit(7)

        const searchedProducts = product.filter((item) => !item.winner).map((item) => {
            const base64Image = fs.readFileSync(item.productImage?.path)
            return {
                _id: item._id,
                productName: item.productName,
                productImage: `data:image/png;base64,${base64Image.toString('base64')}`,
                startsIn: item.startsIn,
                endsIn: item.endsIn,
                currentBid: item.currentBid,
                description: item.description,
                createBy: item.createBy,
                bids: item.bids
            }
        })

        return res.status(200).json({ success: true, products: searchedProducts, catagories })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }

}

const bidWinningController = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        const product: any = await ProductModel.findById(id).populate("bids.userId");

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const highestBid = Math.max(...product.bids.map((item: any) => Number(item.bid)));

        const findBidWinner = product.bids.filter((item: any) => Number(item.bid) === highestBid);

        const userDataObj = {
            userId: findBidWinner[0]?.userId._id,
            message: `Congratulation ${findBidWinner[0]?.userId.displayName} you are the winner of this bid. Your Payable amount is : $${findBidWinner[0]?.bid}`,
            amount: findBidWinner[0]?.bid
        }

        const realTimeWinnerData = {
            productId: product._id,
            email: findBidWinner[0]?.userId.email,
            displayName: findBidWinner[0]?.userId.displayName,
            message: `Congratulation ${findBidWinner[0]?.userId.displayName} you are the winner of this bid.`,
        }

        emitEvent(req, "PRODUCT_WINNER", realTimeWinnerData)

        return res.status(200).json({ success: true, user: userDataObj });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const addSearchSuggestionController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { searchSuggestion }: { searchSuggestion: string } = req.body
        const searchList = await SearchModel.findOne({ searchSuggestion: searchSuggestion.toLowerCase() })

        if (searchList) {
            searchList.searchSuggestion = searchSuggestion.toLowerCase()
            await searchList.save()
            return res.status(200).json({ success: true, message: "Search Saved" })
        }

        await SearchModel.create({
            searchSuggestion: searchSuggestion.toLowerCase()
        })

        return res.status(200).json({ success: true, message: "Search Saved" })

    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

const getSearchSuggestionController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { searchSuggestion = "" } = req.query

        const allSearchList = await SearchModel.find({ searchSuggestion: { $regex: searchSuggestion, $options: "i" } }).limit(7)

        return res.status(200).json({ success: true, search: allSearchList })
    } catch (error: any) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}


export { addProductController, allProductController, singleProductController, productFilterController, bidWinningController, addSearchSuggestionController, getSearchSuggestionController, searchProductController }


