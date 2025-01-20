import express, { Application, Request, Response } from "express"
import dotenv from "dotenv"
import connectionDB from "./config/dbConnection"
import userRoutes from "./routes/userRoutes"
import cors from "cors"
import authRoutes from "./routes/authRoutes"
import passport, { Profile } from "passport"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import UserTokenModel from "./models/token"
import { createJWTToken } from "../utils/features"
import productRoutes from "./routes/productRoutes"
import UserModel from "./models/user"
import { createServer } from "node:http"
import { Server } from "socket.io"
import ProductModel from "./models/product"
import fs from "fs"
import adminRoute from "./routes/adminRoutes"

interface Iuser extends Document {
    googleId: string,
    displayName: string,
    email: string,
    profileImage: string
}

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:4173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

const app: Application = express()
const server = createServer(app)
const io = new Server(server, { cors: corsOptions })
app.set("io", io);

const PORT: string | number = process.env.PORT || 3000

dotenv.config()
connectionDB()

app.use(express.json())
app.use('/uploads', express.static("uploads"))
app.use(express.urlencoded({ extended: false, limit: "10mb" }))
app.use(cors(corsOptions))


app.use(passport.initialize())

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID as string,
        clientSecret: process.env.CLIENT_SECRET as string,
        callbackURL: "/api/v1/auth/google/callback",
        scope: ["profile", "email"]
    },
        async (accessToken, refreshToken, profile, done) => {
            try {

                let user = await UserModel.findOne({ googleId: profile.id })

                if (!user) {
                    user = await UserModel.create({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails?.[0].value,
                        profileImage: {
                            demoImage: profile.photos?.[0].value
                        }
                    })
                }


                const generateToken = createJWTToken(user?._id as string)
                await UserTokenModel.create({
                    token: generateToken,
                    userId: user?._id,
                    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                })
                return done(null, { token: generateToken, user })
            } catch (error) {
                return done(error, false)
            }
        })
)


app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/admin", adminRoute)



io.on('connection', (socket) => {
    console.log('A User Connected :', socket.id);

    socket.on("NEW_BID", async (data, callback) => {
        try {
            const { bidAmount, productId, userId } = data

            const user: any = await UserModel.findById(userId)
            const product: any = await ProductModel.findById(productId).populate("bids.userId")
            const currentDate = new Date(); // Current date and time
            const productEndDate = new Date(product.endsIn);
            if (!user) {
                return callback({
                    success: false,
                    message: "User not found"
                })
            }

            if (!product) {
                return callback({
                    success: false,
                    message: "Product not found"
                })
            }

            if (currentDate > productEndDate) {
                return callback({
                    success: false,
                    message: "Sorry Bidding Time is over"
                })
            }

            if (Number(bidAmount) <= Number(product.currentBid)) {
                return callback({
                    success: false,
                    message: "Your bid is less than or equal to the current bid"
                })
            }

            const existingBidIndex = product?.bids.findIndex((bid: any) => bid.userId._id.toString() === userId)

            if (existingBidIndex >= 0) {
                product.bids[existingBidIndex].bid = bidAmount
                product.currentBid = bidAmount
                await product.save()

                if (!user.recentBid.includes(product._id)) {
                    user.recentBid.push(product._id);
                    await user.save()
                }

                const bids = await Promise.all(
                    product.bids.map(async (item: any) => {
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

                io.emit("BID_UPDATED", {
                    productId: product._id,
                    currentBid: product.currentBid,
                    bids: bids
                })

                return callback({
                    success: true,
                    message: "Bid successfully updated"
                })
            }

            product.currentBid = bidAmount
            product.bids.push({ userId: user._id, bid: bidAmount })
            user.recentBid.push(product._id)

            await product.save()
            await user.save()

            const updatedProduct: any = await ProductModel.findById(productId).populate("bids.userId")

            const bids = await Promise.all(
                updatedProduct.bids.map(async (item: any) => {
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

            io.emit("BID_UPDATED", {
                productId: updatedProduct._id,
                currentBid: updatedProduct.currentBid,
                bids: bids
            })
            return callback({
                success: true,
                message: "Bid successfully added",
            });
        } catch (error: any) {
            console.error("Error placing bid:", error);
            return callback({
                success: false,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("A User Disconnected :", socket.id)
    })
});


server.listen(PORT, () => {
    console.log(`Server is listening at Port No. ${PORT}`)
})