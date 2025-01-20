import mongoose, { Document, Schema, Types } from "mongoose";

interface Bid {
    userId: Types.ObjectId;
    bid?: string;
}

export interface Product extends Document {
    productName: string;
    productImage: {
        filename: string,
        path: string
    }
    genericName: string
    currentBid: mongoose.SchemaDefinitionProperty<number, Product>;
    startsIn: Date;
    endsIn: Date;
    catagory: string
    createBy: mongoose.SchemaDefinitionProperty<Types.ObjectId, Product>;
    winner: mongoose.SchemaDefinitionProperty<Types.ObjectId, Product>
    description: string;
    bids: Bid[];
}

const productSchema: Schema = new mongoose.Schema<Product>(
    {
        productName: {
            type: String,
            required: true,
        },
        startsIn: {
            type: Date,
            required: true
        },
        endsIn: {
            type: Date,
            required: true
        },
        productImage: {
            filename: {
                type: String,
                required: true
            },
            path: {
                type: String,
                required: true
            }
        },
        currentBid: {
            type: Number,
            default: "0",
        },
        catagory: {
            type: String,
            required: true
        },
        genericName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        createBy: {
            type: Types.ObjectId,
            ref: "User"
        },
        winner: {
            type: Types.ObjectId,
            ref: "User"
        },
        bids: [
            {
                userId: {
                    type: Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                bid: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const ProductModel = mongoose.model<Product>("Product", productSchema);

export default ProductModel;
