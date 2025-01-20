import mongoose, { Document, Schema, Types } from "mongoose";


export interface IUser extends Document {
    username: string
    googleId: string
    email: string
    displayName: string
    phoneNo: string
    password: string
    profileImage: {
        filename: string,
        path: string
        demoImage: string
    }
    balance: number,
    bookmarkedProduct: Types.ObjectId[]
    recentBid: Types.ObjectId[]
    winningBid: Types.ObjectId[]
    ownProduct: Types.ObjectId[]
}

const userSchema: Schema = new mongoose.Schema<IUser>({
    googleId: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        default: "",
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: "",
    },
    phoneNo: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        default: "",
        select: false
    },
    balance: {
        type: Number,
        default: 0
    },
    profileImage: {
        filename: {
            type: String,
            default: ""
        },
        path: {
            type: String,
            default: ""
        },
        demoImage: {
            type: String,
            default: ""
        }
    },
    recentBid: [{
        type: Types.ObjectId,
        ref: "Product",
    }],
    bookmarkedProduct: [
        {
            type: Types.ObjectId,
            ref: "Product"
        }
    ],
    winningBid: [{
        type: Types.ObjectId,
        ref: "Product"
    }],
    ownProduct: [{
        type: Types.ObjectId,
        ref: "Product"
    }]
})

const UserModel = mongoose.model<IUser>("User", userSchema)

export default UserModel