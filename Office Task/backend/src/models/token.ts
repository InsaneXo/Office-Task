import mongoose, { Document, Schema, Types } from "mongoose";

// Define the Token interface, which extends mongoose's Document
export interface Token extends Document {
    token: string;
    userId: mongoose.SchemaDefinitionProperty<Types.ObjectId, Token>;
    issuesAt: Date;
    expiresAt: Date;
}

// Define the UserToken schema
const userTokenSchema: Schema = new mongoose.Schema<Token>({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    issuesAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
    }
});

// Create the model from the schema
const UserTokenModel = mongoose.model<Token>("UserToken", userTokenSchema);

export default UserTokenModel;
