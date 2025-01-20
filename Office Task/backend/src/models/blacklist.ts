import mongoose, { Document, Schema, Types } from "mongoose";

// Define the Token interface, which extends mongoose's Document
export interface Token extends Document {
    token: string;
    userId: mongoose.SchemaDefinitionProperty<Types.ObjectId, Token>;
    issuesAt: Date;
    expiresAt: Date;
}

// Define the UserToken schema
const blackListTokenSchema: Schema = new mongoose.Schema<Token>({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    issuesAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Create the model from the schema
const BlackListTokenModel = mongoose.model<Token>("BlackListUserToken", blackListTokenSchema);

export default BlackListTokenModel;
